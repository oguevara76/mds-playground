import type { CatalogSection, CatalogToken } from '../theme/token-catalog.types';
import {
  buildTokenMapsFromSections,
  compLabel,
  extractVarRef,
  resolveVarChain,
} from '../theme/token-catalog.utils';
import type { TokenCatalogService } from '../theme/token-catalog.service';
import type {
  BuildTokenMapOptions,
  MapCompGroup,
  MapTokenRow,
  TokenMapModel,
  VvConnData,
} from './token-map.types';

function formatDepsList(labels: string[]): string | undefined {
  if (!labels.length) return undefined;
  return `Dependencias: ${labels.join(', ')}`;
}

function formatViaList(labels: string[]): string | undefined {
  if (!labels.length) return undefined;
  return labels.length === 1 ? `Vía ${labels[0]}` : `Vía ${labels.join(', ')}`;
}

/** Cadena de refs `var()` desde un valor hasta Sem/Prim (incluidos). */
function collectVarChain(
  value: string,
  valueMap: Map<string, string>,
  primSet: Set<string>,
  semSet: Set<string>,
  maxDepth = 8
): string[] {
  const chain: string[] = [];
  let current = (value || '').trim();
  const visited = new Set<string>();

  for (let i = 0; i < maxDepth; i++) {
    const ref = extractVarRef(current);
    if (!ref || visited.has(ref)) break;
    visited.add(ref);
    chain.push(ref);
    if (semSet.has(ref) || primSet.has(ref)) break;
    const next = valueMap.get(ref);
    if (!next) break;
    current = next;
  }

  return chain;
}

function componentsAffectingPrim(
  primName: string,
  semRefMap: Map<string, string>,
  semAffects: Record<string, string[]>,
  compRefMap: Map<string, string>,
  selectedLabel: string
): string[] {
  const labels = new Set<string>();

  for (const [sem, prim] of semRefMap) {
    if (prim !== primName) continue;
    for (const l of semAffects[sem] ?? []) labels.add(l);
  }

  for (const [compToken, ref] of compRefMap) {
    if (ref === primName) labels.add(compLabel(compToken));
  }

  labels.delete(selectedLabel);
  return [...labels].sort((a, b) => a.localeCompare(b, 'es'));
}

function toCompGroup(
  label: string,
  rows: MapTokenRow[],
  role: 'selected' | 'via' | 'default' = 'default'
): MapCompGroup {
  const safeId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return { label, safeId, storeKey: `comp-${safeId}`, rows, role };
}

function buildScopedComponentModel(
  sections: CatalogSection[],
  catalog: TokenCatalogService,
  componentLabel: string,
  allPrimVars: CatalogToken[],
  allSemVars: CatalogToken[],
  allCompVars: CatalogToken[],
  primSet: Set<string>,
  semSet: Set<string>,
  valueMap: Map<string, string>,
  semRefMap: Map<string, string>,
  semTheme: TokenMapModel['semTheme']
): TokenMapModel {
  const { semAffects } = buildTokenMapsFromSections(sections);
  const tokenByName = new Map(allCompVars.map((t) => [t.name, t]));

  const selectedTokens = allCompVars.filter((t) => compLabel(t.name) === componentLabel);

  /** Ref inmediata (hop) por token de componente en el grafo scoped. */
  const hopRefMap = new Map<string, string>();
  const viaTokenNames = new Set<string>();
  const connSemNames = new Set<string>();
  const connPrimNames = new Set<string>();

  const registerChain = (chain: string[]) => {
    for (const ref of chain) {
      if (semSet.has(ref)) {
        connSemNames.add(ref);
        const prim = semRefMap.get(ref);
        if (prim) connPrimNames.add(prim);
      } else if (primSet.has(ref)) {
        connPrimNames.add(ref);
      } else if (tokenByName.has(ref) && compLabel(ref) !== componentLabel) {
        viaTokenNames.add(ref);
      }
    }
  };

  selectedTokens.forEach((t) => {
    const chain = collectVarChain(t.value, valueMap, primSet, semSet);
    if (!chain.length) return;
    hopRefMap.set(t.name, chain[0]);
    registerChain(chain);
  });

  // Cadenas de tokens vía (Overlay → Sem → Prim)
  viaTokenNames.forEach((name) => {
    const token = tokenByName.get(name);
    if (!token) return;
    const chain = collectVarChain(token.value, valueMap, primSet, semSet);
    if (!chain.length) return;
    hopRefMap.set(name, chain[0]);
    registerChain(chain);
  });

  // Incluir hops adicionales descubiertos en vias
  let grew = true;
  while (grew) {
    grew = false;
    for (const name of [...viaTokenNames]) {
      const token = tokenByName.get(name);
      if (!token) continue;
      const chain = collectVarChain(token.value, valueMap, primSet, semSet);
      if (!chain.length) continue;
      if (!hopRefMap.has(name)) hopRefMap.set(name, chain[0]);
      const before = viaTokenNames.size + connSemNames.size + connPrimNames.size;
      registerChain(chain);
      if (viaTokenNames.size + connSemNames.size + connPrimNames.size > before) grew = true;
    }
  }

  const filteredPrims = allPrimVars.filter((t) => connPrimNames.has(t.name));
  const filteredSems = allSemVars.filter((t) => connSemNames.has(t.name));

  const semResolved =
    semTheme && filteredSems.length
      ? catalog.batchResolveTokens(filteredSems, semTheme)
      : null;

  const rightDotTargets = new Set<string>([
    ...hopRefMap.values(),
    ...[...connSemNames].map((s) => semRefMap.get(s)).filter((p): p is string => !!p),
  ]);

  const selectedConnected = selectedTokens.filter((t) => hopRefMap.has(t.name));
  const selectedSource = selectedConnected.length ? selectedConnected : selectedTokens;

  const selectedRows: MapTokenRow[] = selectedSource.map((t) => {
    const chain = collectVarChain(t.value, valueMap, primSet, semSet);
    const viaLabels = [
      ...new Set(
        chain
          .filter((r) => !semSet.has(r) && !primSet.has(r))
          .map((r) => compLabel(r))
          .filter((l) => l !== componentLabel)
      ),
    ].sort((a, b) => a.localeCompare(b, 'es'));

    return {
      token: t,
      vtype: 'comp',
      leftRef: hopRefMap.get(t.name) ?? null,
      depsSubtext: formatViaList(viaLabels),
      showRightDot: rightDotTargets.has(t.name),
    };
  });

  const viaByGroup = new Map<string, MapTokenRow[]>();
  [...viaTokenNames]
    .sort((a, b) => a.localeCompare(b, 'es'))
    .forEach((name) => {
      const token = tokenByName.get(name);
      if (!token) return;
      const grp = compLabel(name);
      if (!viaByGroup.has(grp)) viaByGroup.set(grp, []);
      viaByGroup.get(grp)!.push({
        token,
        vtype: 'comp',
        leftRef: hopRefMap.get(name) ?? null,
        showRightDot: rightDotTargets.has(name),
      });
    });

  const viaGroups = [...viaByGroup.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([label, rows]) => toCompGroup(label, rows, 'via'));

  const selectedGroup = toCompGroup(componentLabel, selectedRows, 'selected');
  const compGroups = [...viaGroups, selectedGroup];

  // connData: hops inmediatos para highlight / líneas lógicas
  const scopedCompRefMap = new Map(hopRefMap);
  // Mantener también resolución final Sem/Prim para tokens sin hop intermedio ya cubiertos
  selectedTokens.forEach((t) => {
    if (scopedCompRefMap.has(t.name)) return;
    const ref =
      resolveVarChain(t.value, valueMap, semSet) || resolveVarChain(t.value, valueMap, primSet);
    if (ref) scopedCompRefMap.set(t.name, ref);
  });

  return {
    connData: {
      semRefMap,
      compRefMap: scopedCompRefMap,
      primSet,
      semSet,
    },
    primRows: filteredPrims.map((t) => ({
      token: t,
      vtype: 'prim' as const,
      leftRef: null,
      depsSubtext: formatDepsList(
        componentsAffectingPrim(t.name, semRefMap, semAffects, scopedCompRefMap, componentLabel)
      ),
      showRightDot: true,
    })),
    semRows: filteredSems.map((t) => {
      const others = (semAffects[t.name] ?? []).filter((l) => l !== componentLabel);
      return {
        token: t,
        vtype: 'sem' as const,
        leftRef: semRefMap.get(t.name) ?? null,
        depsSubtext: formatDepsList(others),
        showRightDot: true,
      };
    }),
    semTheme,
    semResolved,
    compGroups,
  };
}

export function buildTokenMapModel(
  sections: CatalogSection[],
  catalog: TokenCatalogService,
  options: BuildTokenMapOptions = {}
): TokenMapModel {
  const componentLabel = options.componentLabel?.trim() || null;

  const primSec = sections.find((s) => s.id === 'primitivos');
  const semSec = sections.find((s) => s.id === 'semanticos');
  const compSec = sections.find((s) => s.id === 'componentes');

  const allPrimVars = primSec?.subGroups.flatMap((sg) => sg.tokens) ?? [];
  const allSemVars = semSec?.subGroups.flatMap((sg) => sg.tokens) ?? [];
  const allCompVars = compSec?.subGroups.flatMap((sg) => sg.tokens) ?? [];
  const semTheme = semSec?.subGroups[0]?.theme ?? null;

  const primSet = new Set(allPrimVars.map((t) => t.name));
  const semSet = new Set(allSemVars.map((t) => t.name));

  const valueMap = new Map<string, string>();
  allPrimVars.forEach((t) => valueMap.set(t.name, t.value));
  allSemVars.forEach((t) => valueMap.set(t.name, t.value));
  allCompVars.forEach((t) => valueMap.set(t.name, t.value));

  const semRefMap = new Map<string, string>();
  allSemVars.forEach((t) => {
    const ref = resolveVarChain(t.value, valueMap, primSet);
    if (ref) semRefMap.set(t.name, ref);
  });

  if (componentLabel) {
    return buildScopedComponentModel(
      sections,
      catalog,
      componentLabel,
      allPrimVars,
      allSemVars,
      allCompVars,
      primSet,
      semSet,
      valueMap,
      semRefMap,
      semTheme
    );
  }

  const compRefMap = new Map<string, string>();
  allCompVars.forEach((t) => {
    const ref =
      resolveVarChain(t.value, valueMap, semSet) || resolveVarChain(t.value, valueMap, primSet);
    if (ref) compRefMap.set(t.name, ref);
  });

  const connData: VvConnData = { semRefMap, compRefMap, primSet, semSet };

  const connPrimNames = new Set(semRefMap.values());
  const connSemNames = new Set([
    ...semRefMap.keys(),
    ...[...compRefMap.values()].filter((r) => semSet.has(r)),
  ]);

  const filteredPrims = allPrimVars.filter((t) => connPrimNames.has(t.name));
  const filteredSems = allSemVars.filter((t) => connSemNames.has(t.name));
  const filteredComps = allCompVars.filter((t) => compRefMap.has(t.name));

  const semResolved =
    semTheme && filteredSems.length
      ? catalog.batchResolveTokens(filteredSems, semTheme)
      : null;

  const compGroupMap = new Map<string, MapTokenRow[]>();
  filteredComps.forEach((t) => {
    const grp = compLabel(t.name);
    if (!compGroupMap.has(grp)) compGroupMap.set(grp, []);
    compGroupMap.get(grp)!.push({
      token: t,
      vtype: 'comp',
      leftRef: compRefMap.get(t.name) ?? null,
    });
  });

  const compGroups: MapCompGroup[] = [...compGroupMap.entries()].map(([label, rows]) =>
    toCompGroup(label, rows, 'default')
  );

  return {
    connData,
    primRows: filteredPrims.map((t) => ({ token: t, vtype: 'prim', leftRef: null })),
    semRows: filteredSems.map((t) => ({
      token: t,
      vtype: 'sem',
      leftRef: semRefMap.get(t.name) ?? null,
    })),
    semTheme,
    semResolved,
    compGroups,
  };
}
