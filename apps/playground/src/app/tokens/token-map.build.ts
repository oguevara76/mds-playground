import type { CatalogSection } from '../theme/token-catalog.types';
import { compLabel, resolveVarChain } from '../theme/token-catalog.utils';
import type { TokenCatalogService } from '../theme/token-catalog.service';
import type { MapCompGroup, MapTokenRow, TokenMapModel, VvConnData } from './token-map.types';

export function buildTokenMapModel(
  sections: CatalogSection[],
  catalog: TokenCatalogService
): TokenMapModel {
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

  const compGroups: MapCompGroup[] = [...compGroupMap.entries()].map(([label, rows]) => {
    const safeId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return { label, safeId, storeKey: `comp-${safeId}`, rows };
  });

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
