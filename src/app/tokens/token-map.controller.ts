import type { ResolvedMap, ResolvedTokenColor } from '../theme/token-catalog.types';
import type { TokenCatalogService } from '../theme/token-catalog.service';
import { isDarkColor, rgbToHex } from '../theme/token-catalog.utils';
import { buildTokenMapModel } from './token-map.build';
import type { MapCompGroup, MapTokenRow, PanelPos, TokenMapModel, VvConnData } from './token-map.types';

const VV_ZOOM_MIN = 0.2;
const VV_ZOOM_MAX = 2.5;
const VV_ZOOM_STEP = 0.12;
const COMP_PANEL_W = 240;
const COMP_PANEL_GAP = 60;
const COMP_ROW_GAP = 40;
const COMP_COLS = 10;

const VV_DEFAULT_POS = {
  prim: { x: 40, y: 40 },
  sem: { x: 590, y: 40 },
  comp: { x: 1140, y: 40 },
};

function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

type DragInteraction = {
  type: 'drag';
  draggable: HTMLElement;
  key: string;
  moved: boolean;
  isComp: boolean;
  startCX: number;
  startCY: number;
  origX: number;
  origY: number;
};

type PanInteraction = {
  type: 'pan';
  moved: boolean;
  startCX: number;
  startCY: number;
  panOffX: number;
  panOffY: number;
};

type VvInteraction = DragInteraction | PanInteraction;

export type TokenMapUiState = {
  zoomPercent: number;
  mapSearchQuery: string;
};

/** Controlador imperativo del mapa de tokens (paridad con js/app.js). */
export class TokenMapController {
  private zoom = 1;
  private pan = { x: 40, y: 40 };
  private readonly posStore = {
    prim: { ...VV_DEFAULT_POS.prim },
    sem: { ...VV_DEFAULT_POS.sem },
    comp: { ...VV_DEFAULT_POS.comp },
  };
  private readonly compPosStore = new Map<string, PanelPos>();
  private connData: VvConnData = {
    semRefMap: new Map(),
    compRefMap: new Map(),
    primSet: new Set(),
    semSet: new Set(),
  };
  private selectedVar: string | null = null;
  private clickSuppressed = false;
  private mapSearchQuery = '';
  private componentLabel: string | null = null;
  private interaction: VvInteraction | null = null;
  private globalListenersBound = false;
  private canvasBound = false;
  private readonly onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
  private readonly onMouseUp = () => this.handleMouseUp();
  private uiListener: ((state: TokenMapUiState) => void) | null = null;

  constructor(
    private readonly doc: Document,
    private readonly host: HTMLElement,
    private readonly catalog: TokenCatalogService
  ) {}

  /** Filtra el mapa a un único grupo de componente (`compLabel`). `null` = mapa completo. */
  setComponentFilter(label: string | null): void {
    this.componentLabel = label?.trim() || null;
  }

  setUiListener(listener: ((state: TokenMapUiState) => void) | null): void {
    this.uiListener = listener;
    this.notifyUi();
  }

  zoomIn(): void {
    this.zoom = Math.min(VV_ZOOM_MAX, +(this.zoom + VV_ZOOM_STEP).toFixed(2));
    this.applyTransform();
    requestAnimationFrame(() => this.drawLines());
  }

  zoomOut(): void {
    this.zoom = Math.max(VV_ZOOM_MIN, +(this.zoom - VV_ZOOM_STEP).toFixed(2));
    this.applyTransform();
    requestAnimationFrame(() => this.drawLines());
  }

  resetView(): void {
    this.zoom = 1;
    this.pan = { x: 40, y: 40 };
    this.posStore.prim = { ...VV_DEFAULT_POS.prim };
    this.posStore.sem = { ...VV_DEFAULT_POS.sem };
    this.posStore.comp = { ...VV_DEFAULT_POS.comp };
    this.compPosStore.clear();
    this.mapSearchQuery = '';
    this.render();
    this.notifyUi();
  }

  setMapSearch(query: string): void {
    this.mapSearchQuery = (query || '').trim();
    this.applySearch(this.mapSearchQuery);
    this.notifyUi();
  }

  destroy(): void {
    this.doc.removeEventListener('mousemove', this.onMouseMove);
    this.doc.removeEventListener('mouseup', this.onMouseUp);
    this.uiListener = null;
    this.host.innerHTML = '';
    this.canvasBound = false;
  }

  /** Tras upload/eliminación: resetea layout y vuelve a calcular conexiones. */
  refreshWithReconnect(onComplete?: () => void): void {
    this.compPosStore.clear();
    this.posStore.prim = { ...VV_DEFAULT_POS.prim };
    this.posStore.sem = { ...VV_DEFAULT_POS.sem };
    this.posStore.comp = { ...VV_DEFAULT_POS.comp };
    this.selectedVar = null;
    this.render(onComplete);
  }

  render(onComplete?: () => void): void {
    const model = buildTokenMapModel(this.catalog.sections(), this.catalog, {
      componentLabel: this.componentLabel,
    });
    this.connData = model.connData;
    this.selectedVar = null;
    this.canvasBound = false;
    this.host.innerHTML = this.buildHtml(model);
    this.ensureGlobalListeners();
    this.bindCanvas(this.host.querySelector('#vv-canvas'));
    if (this.mapSearchQuery) this.applySearch(this.mapSearchQuery);
    this.notifyUi();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.restack();
        this.drawLines();
        onComplete?.();
      })
    );
  }

  private notifyUi(): void {
    this.uiListener?.({
      zoomPercent: Math.round(this.zoom * 100),
      mapSearchQuery: this.mapSearchQuery,
    });
  }

  private buildHtml(model: TokenMapModel): string {
    const gridPos = this.computeCompGridPositions(model.compGroups);
    model.compGroups.forEach((g, i) => {
      if (!this.compPosStore.has(g.storeKey)) {
        this.compPosStore.set(g.storeKey, gridPos[i]);
      }
    });

    const primBody = model.primRows.length
      ? model.primRows.map((r) => this.mkRowHtml(r, model.semResolved)).join('')
      : '<p class="vv-empty">Sin conexiones</p>';
    const semBody = model.semRows.length
      ? model.semRows.map((r) => this.mkRowHtml(r, model.semResolved)).join('')
      : '<p class="vv-empty">Sin conexiones</p>';

    const compPanels = model.compGroups
      .map((g) => {
        const pos = this.compPosStore.get(g.storeKey)!;
        const body = g.rows.length
          ? g.rows.map((r) => this.mkRowHtml(r, null)).join('')
          : '<p class="vv-empty">Sin variables</p>';
        const roleCls =
          g.role === 'selected'
            ? ' vv-panel-comp-selected'
            : g.role === 'via'
              ? ' vv-panel-comp-via'
              : '';
        const roleIcon =
          g.role === 'selected'
            ? '<i class="pi pi-box vv-role-icon" aria-hidden="true" title="Componente"></i>'
            : g.role === 'via'
              ? '<i class="pi pi-share-alt vv-role-icon" aria-hidden="true" title="Vía"></i>'
              : '';
        return `<div class="vv-panel vv-panel-comp${roleCls}" id="vv-comp-${g.safeId}" style="left:${pos.x}px;top:${pos.y}px">
        <div class="vv-phdr" data-drag="${escAttr(g.storeKey)}">
          ${roleIcon}${escHtml(g.label)}<span class="vv-pc">${g.rows.length}</span>
        </div>
        <div class="vv-pbody-fit">${body}</div>
      </div>`;
      })
      .join('');

    const pp = this.posStore.prim;
    const sp = this.posStore.sem;

    return `
      <div class="vv-canvas" id="vv-canvas">
        <div class="vv-world" id="vv-world" style="transform:translate(${this.pan.x}px,${this.pan.y}px) scale(${this.zoom});transform-origin:0 0;">
          <svg id="vv-svg-bg" style="position:absolute;top:0;left:0;pointer-events:none;z-index:1;overflow:visible;" width="1" height="1"></svg>
          <svg id="vv-svg-fg" style="position:absolute;top:0;left:0;pointer-events:none;z-index:50;overflow:visible;" width="1" height="1"></svg>
          <div class="vv-panel vv-panel-fit" id="vv-prim" style="left:${pp.x}px;top:${pp.y}px">
            <div class="vv-phdr" data-drag="prim">
              <i class="pi pi-box" aria-hidden="true"></i> Primitives
              <span class="vv-pc">${model.primRows.length}</span>
            </div>
            <div class="vv-pbody-fit">${primBody}</div>
          </div>
          <div class="vv-panel vv-panel-fit" id="vv-sem" style="left:${sp.x}px;top:${sp.y}px">
            <div class="vv-phdr" data-drag="sem">
              <i class="pi pi-sliders-h" aria-hidden="true"></i> Semantics
              <span class="vv-pc">${model.semRows.length}</span>
            </div>
            <div class="vv-pbody-fit">${semBody}</div>
          </div>
          ${compPanels}
        </div>
      </div>`;
  }

  private mkRowHtml(row: MapTokenRow, semResolved: ResolvedMap | null): string {
    const t = row.token;
    const sw = this.swHtml(t.name, t.type, semResolved);
    const ld = row.leftRef
      ? `<span class="vv-dot vv-dot-l" data-cref="${escAttr(row.leftRef)}"></span>`
      : '<span class="vv-dot-sp"></span>';
    const showRight = row.showRightDot ?? row.vtype !== 'comp';
    const rd = showRight
      ? `<span class="vv-dot vv-dot-r" data-sdot="${escAttr(t.name)}"></span>`
      : '';
    const label = t.label.replace(/^p-/, '');
    const deps = row.depsSubtext
      ? `<span class="vv-deps">${escHtml(row.depsSubtext)}</span>`
      : '';
    return `<div class="vv-row" data-var="${escAttr(t.name)}" data-vtype="${row.vtype}">
      ${ld}${sw}<span class="vv-info"><span class="vv-name">${escHtml(label)}</span>${deps}</span>${rd}
    </div>`;
  }

  private swHtml(name: string, type: string, resolvedMap: ResolvedMap | null): string {
    if (type === 'color') {
      const r = resolvedMap?.[name] as ResolvedTokenColor | undefined;
      const rgb = r ? null : this.catalog.resolveTokenColor(name);
      const hex = r?.hex ?? rgbToHex(rgb || '');
      const dk = r?.dk ?? isDarkColor(rgb || '');
      const bg = hex ? `#${hex}` : `var(${name})`;
      return `<span class="vv-sw${dk ? ' dk' : ''}" style="background:${bg}"></span>`;
    }
    const isDim = /dimension|spacing|radius/i.test(name);
    return isDim
      ? '<span class="vv-sw vv-sw-dim"></span>'
      : '<span class="vv-sw vv-sw-text">Aa</span>';
  }

  private computeCompGridPositions(compGroups: MapCompGroup[]): PanelPos[] {
    // Modo Component: Prim → Sem → [Vías] → Componente seleccionado (una fila).
    if (this.componentLabel) {
      const semW = 290;
      const startX = this.posStore.sem.x + semW + COMP_PANEL_GAP;
      const y = this.posStore.sem.y;
      let x = startX;
      // Sin `col`: restack no los apila en vertical; quedan en fila Prim→Sem→Vía→Comp.
      return compGroups.map((g) => {
        const pos: PanelPos = { x, y };
        const w = g.role === 'selected' ? 280 : COMP_PANEL_W;
        x += w + COMP_PANEL_GAP;
        return pos;
      });
    }

    const colTokenCount = Array(COMP_COLS).fill(0);
    return compGroups.map((g) => {
      const col = colTokenCount.indexOf(Math.min(...colTokenCount));
      colTokenCount[col] += g.rows.length;
      return {
        x: this.posStore.comp.x + col * (COMP_PANEL_W + COMP_PANEL_GAP),
        y: this.posStore.comp.y,
        col,
      };
    });
  }

  private ensureGlobalListeners(): void {
    if (this.globalListenersBound) return;
    this.globalListenersBound = true;
    this.doc.addEventListener('mousemove', this.onMouseMove);
    this.doc.addEventListener('mouseup', this.onMouseUp);
  }

  private bindCanvas(canvas: Element | null): void {
    if (!canvas || !(canvas instanceof HTMLElement) || this.canvasBound) return;
    this.canvasBound = true;

    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? VV_ZOOM_STEP : -VV_ZOOM_STEP;
        const newZoom = Math.min(
          VV_ZOOM_MAX,
          Math.max(VV_ZOOM_MIN, +(this.zoom + delta).toFixed(2))
        );
        if (newZoom === this.zoom) return;
        const cRect = canvas.getBoundingClientRect();
        const mx = e.clientX - cRect.left;
        const my = e.clientY - cRect.top;
        const scale = newZoom / this.zoom;
        this.pan.x = mx - scale * (mx - this.pan.x);
        this.pan.y = my - scale * (my - this.pan.y);
        this.zoom = newZoom;
        this.applyTransform();
        requestAnimationFrame(() => this.drawLines());
      },
      { passive: false }
    );

    canvas.addEventListener('mousedown', (e) => {
      const hdr = (e.target as Element).closest('[data-drag]');
      if (hdr instanceof HTMLElement && hdr.dataset['drag']) {
        const key = hdr.dataset['drag'];
        const draggable = hdr.closest('.vv-panel');
        if (!(draggable instanceof HTMLElement)) return;
        e.preventDefault();
        const isComp = key.startsWith('comp-');
        const orig = isComp
          ? (this.compPosStore.get(key) ?? { x: 0, y: 0 })
          : (this.posStore[key as 'prim' | 'sem'] ?? { x: 0, y: 0 });
        this.interaction = {
          type: 'drag',
          draggable,
          key,
          moved: false,
          isComp,
          startCX: e.clientX,
          startCY: e.clientY,
          origX: orig.x,
          origY: orig.y,
        };
        draggable.classList.add('vv-dragging');
      } else if (!(e.target as Element).closest('.vv-pbody-fit, .vv-panel-body')) {
        e.preventDefault();
        this.interaction = {
          type: 'pan',
          moved: false,
          startCX: e.clientX,
          startCY: e.clientY,
          panOffX: e.clientX - this.pan.x,
          panOffY: e.clientY - this.pan.y,
        };
        canvas.classList.add('is-panning');
      }
    });

    canvas.addEventListener('click', (e) => {
      if (this.clickSuppressed) {
        this.clickSuppressed = false;
        return;
      }
      const row = (e.target as Element).closest('.vv-row[data-var]');
      if (row instanceof HTMLElement && row.dataset['var']) {
        this.selectVar(row.dataset['var']);
      } else if (!(e.target as Element).closest('.vv-panel')) {
        this.deselect();
      }
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.interaction) return;
    if (!this.interaction.moved) {
      if (
        Math.abs(e.clientX - this.interaction.startCX) > 3 ||
        Math.abs(e.clientY - this.interaction.startCY) > 3
      ) {
        this.interaction.moved = true;
      }
    }
    if (this.interaction.type === 'drag') {
      const nx = this.interaction.origX + (e.clientX - this.interaction.startCX) / this.zoom;
      const ny = this.interaction.origY + (e.clientY - this.interaction.startCY) / this.zoom;
      const key = this.interaction.key;
      if (this.interaction.isComp) {
        const prev = this.compPosStore.get(key) ?? { x: nx, y: ny };
        this.compPosStore.set(key, { ...prev, x: nx, y: ny });
      } else {
        this.posStore[key as 'prim' | 'sem'] = { x: nx, y: ny };
      }
      this.interaction.draggable.style.left = `${nx}px`;
      this.interaction.draggable.style.top = `${ny}px`;
      requestAnimationFrame(() => this.drawLines());
    } else if (this.interaction.type === 'pan') {
      this.pan.x = e.clientX - this.interaction.panOffX;
      this.pan.y = e.clientY - this.interaction.panOffY;
      this.applyTransform();
      requestAnimationFrame(() => this.drawLines());
    }
  }

  private handleMouseUp(): void {
    if (!this.interaction) return;
    if (this.interaction.moved) this.clickSuppressed = true;
    if (this.interaction.type === 'drag') {
      this.interaction.draggable.classList.remove('vv-dragging');
    } else {
      this.host.querySelector('#vv-canvas')?.classList.remove('is-panning');
    }
    this.interaction = null;
  }

  private applyTransform(): void {
    const world = this.host.querySelector('#vv-world');
    if (world instanceof HTMLElement) {
      world.style.transform = `translate(${this.pan.x}px,${this.pan.y}px) scale(${this.zoom})`;
    }
    this.notifyUi();
  }

  private restack(): void {
    const cols = new Map<number, { key: string; el: HTMLElement }[]>();
    this.host.querySelectorAll('#vv-canvas .vv-panel-comp').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const hdr = el.querySelector('[data-drag]');
      if (!(hdr instanceof HTMLElement) || !hdr.dataset['drag']) return;
      const key = hdr.dataset['drag'];
      const stored = this.compPosStore.get(key);
      if (!stored || stored.col === undefined) return;
      if (!cols.has(stored.col)) cols.set(stored.col, []);
      cols.get(stored.col)!.push({ key, el });
    });

    cols.forEach((panels) => {
      panels.sort(
        (a, b) =>
          (this.compPosStore.get(a.key)?.y ?? 0) - (this.compPosStore.get(b.key)?.y ?? 0)
      );
      let y = this.posStore.comp.y;
      panels.forEach(({ key, el }) => {
        const stored = this.compPosStore.get(key);
        this.compPosStore.set(key, { ...stored!, y });
        el.style.top = `${y}px`;
        y += el.offsetHeight + COMP_ROW_GAP;
      });
    });
    requestAnimationFrame(() => this.drawLines());
  }

  private applySearch(q: string): void {
    const world = this.host.querySelector('#vv-world');
    if (!(world instanceof HTMLElement)) return;
    const lq = q.toLowerCase();
    if (!lq) {
      world.removeAttribute('data-search');
      world.querySelectorAll('[data-smatch]').forEach((el) => el.removeAttribute('data-smatch'));
    } else {
      world.setAttribute('data-search', '1');
      const directHits = new Set<string>();
      world.querySelectorAll('[data-var]').forEach((row) => {
        if (!(row instanceof HTMLElement) || !row.dataset['var']) return;
        const matches = row.dataset['var'].toLowerCase().includes(lq);
        row.toggleAttribute('data-smatch', matches);
        if (matches) directHits.add(row.dataset['var']);
      });

      const { semRefMap, primSet, semSet } = this.connData;
      const allHits = new Set(directHits);

      directHits.forEach((name) => {
        if (primSet.has(name)) {
          semRefMap.forEach((primRef, semName) => {
            if (primRef !== name) return;
            allHits.add(semName);
            this.compsReaching(semName, allHits);
          });
          this.compsReaching(name, allHits);
        } else if (semSet.has(name)) {
          const primRef = semRefMap.get(name);
          if (primRef) allHits.add(primRef);
          this.compsReaching(name, allHits);
        } else {
          this.walkCompChain(name, allHits);
          this.compsReaching(name, allHits);
        }
      });

      world.querySelectorAll('[data-var]').forEach((row) => {
        if (row instanceof HTMLElement && row.dataset['var']) {
          row.toggleAttribute('data-smatch', allHits.has(row.dataset['var']));
        }
      });
    }
    requestAnimationFrame(() => this.drawLines());
  }

  /** Sigue hops de compRefMap hasta Sem/Prim. */
  private walkCompChain(start: string, into: Set<string>): void {
    const { semRefMap, compRefMap, primSet, semSet } = this.connData;
    let ref: string | undefined = compRefMap.get(start);
    const visited = new Set<string>();
    while (ref && !visited.has(ref)) {
      visited.add(ref);
      into.add(ref);
      if (primSet.has(ref)) break;
      if (semSet.has(ref)) {
        const primRef = semRefMap.get(ref);
        if (primRef) into.add(primRef);
        break;
      }
      ref = compRefMap.get(ref);
    }
  }

  /** Componentes (directos o vía hops) que terminan alcanzando `target`. */
  private compsReaching(target: string, into: Set<string>): void {
    const { compRefMap, semRefMap, primSet } = this.connData;
    compRefMap.forEach((_ref, compName) => {
      const chain = new Set<string>();
      this.walkCompChain(compName, chain);
      if (chain.has(target)) into.add(compName);
    });
    if (primSet.has(target)) {
      semRefMap.forEach((primRef, semName) => {
        if (primRef !== target) return;
        this.compsReaching(semName, into);
      });
    }
  }

  private buildHlSet(varName: string): Set<string> {
    const { semRefMap, primSet, semSet } = this.connData;
    const hl = new Set([varName]);

    if (primSet.has(varName)) {
      semRefMap.forEach((primRef, semName) => {
        if (primRef === varName) {
          hl.add(semName);
          this.compsReaching(semName, hl);
        }
      });
      this.compsReaching(varName, hl);
    } else if (semSet.has(varName)) {
      const primRef = semRefMap.get(varName);
      if (primRef) hl.add(primRef);
      this.compsReaching(varName, hl);
    } else {
      this.walkCompChain(varName, hl);
      // Upstream: otros comps que dependen de este token
      this.compsReaching(varName, hl);
    }
    return hl;
  }

  private selectVar(varName: string): void {
    const world = this.host.querySelector('#vv-world');
    if (!(world instanceof HTMLElement)) return;
    if (this.selectedVar === varName) {
      this.deselect();
      return;
    }
    this.selectedVar = varName;
    const hlVars = this.buildHlSet(varName);
    world.setAttribute('data-sel', '1');
    world.querySelectorAll('[data-var]').forEach((row) => {
      if (row instanceof HTMLElement && row.dataset['var']) {
        row.toggleAttribute('data-hl', hlVars.has(row.dataset['var']));
      }
    });
    requestAnimationFrame(() => this.drawLines());
  }

  private deselect(): void {
    this.selectedVar = null;
    const world = this.host.querySelector('#vv-world');
    if (!(world instanceof HTMLElement)) return;
    world.removeAttribute('data-sel');
    world.querySelectorAll('[data-hl]').forEach((el) => el.removeAttribute('data-hl'));
    requestAnimationFrame(() => this.drawLines());
  }

  private drawLines(): void {
    const svgBg = this.host.querySelector('#vv-svg-bg');
    const svgFg = this.host.querySelector('#vv-svg-fg');
    const canvas = this.host.querySelector('#vv-canvas');
    if (!(svgBg instanceof SVGElement) || !(svgFg instanceof SVGElement) || !(canvas instanceof HTMLElement)) {
      return;
    }

    const canvasR = canvas.getBoundingClientRect();
    const hlVars = this.selectedVar ? this.buildHlSet(this.selectedVar) : null;
    const hasSel = !!hlVars;
    const world = this.host.querySelector('#vv-world');
    const hasSearch = !hasSel && world?.hasAttribute('data-search');
    const searchHits = hasSearch
      ? new Set(
          [...(world?.querySelectorAll('[data-var][data-smatch]') ?? [])]
            .map((el) => (el as HTMLElement).dataset['var'])
            .filter(Boolean) as string[]
        )
      : null;

    const toWorld = (cx: number, cy: number) => ({
      x: (cx - canvasR.left - this.pan.x) / this.zoom,
      y: (cy - canvasR.top - this.pan.y) / this.zoom,
    });
    const dotWorld = (el: Element) => {
      const r = el.getBoundingClientRect();
      return toWorld((r.left + r.right) / 2, (r.top + r.bottom) / 2);
    };

    const rdMap: Record<string, Element> = {};
    canvas.querySelectorAll('.vv-dot-r[data-sdot]').forEach((d) => {
      if (d instanceof HTMLElement && d.dataset['sdot']) rdMap[d.dataset['sdot']] = d;
    });

    let bgPaths = '';
    let fgPaths = '';

    canvas.querySelectorAll('.vv-dot-l[data-cref]').forEach((cd) => {
      if (!(cd instanceof HTMLElement) || !cd.dataset['cref']) return;
      const sd = rdMap[cd.dataset['cref']];
      if (!sd) return;

      const cdR = cd.getBoundingClientRect();
      const sdR = sd.getBoundingClientRect();
      const visible = (r: DOMRect) =>
        r.right > canvasR.left &&
        r.left < canvasR.right &&
        r.bottom > canvasR.top &&
        r.top < canvasR.bottom;
      if (!visible(cdR) && !visible(sdR)) return;

      const srcVar = (sd as HTMLElement).dataset['sdot']!;
      const row = cd.closest('[data-var]');
      const dstVar =
        row instanceof HTMLElement && row.dataset['var'] ? row.dataset['var'] : null;
      const isHl = hasSel && hlVars!.has(srcVar) && dstVar && hlVars!.has(dstVar);

      const p1 = dotWorld(sd);
      const p2 = dotWorld(cd);
      const dx = Math.abs(p2.x - p1.x) * 0.45;
      const d = `M${p1.x},${p1.y} C${p1.x + dx},${p1.y} ${p2.x - dx},${p2.y} ${p2.x},${p2.y}`;

      let col: string;
      let width: number;
      let isFg = false;

      if (hasSel) {
        if (isHl) {
          col = p1.x < p2.x ? 'rgba(20,184,166,.95)' : 'rgba(59,130,246,.95)';
          width = 2.5;
          isFg = true;
        } else {
          col = 'rgba(150,150,150,.08)';
          width = 1;
        }
      } else if (searchHits) {
        const srcHit = searchHits.has(srcVar);
        const dstHit = dstVar && searchHits.has(dstVar);
        if (srcHit && dstHit) {
          col = p1.x < p2.x ? 'rgba(20,184,166,.95)' : 'rgba(59,130,246,.95)';
          width = 2.5;
          isFg = true;
        } else {
          col = 'rgba(150,150,150,.07)';
          width = 1;
        }
      } else {
        col = p1.x < p2.x ? 'rgba(20,184,166,.35)' : 'rgba(59,130,246,.35)';
        width = 1.4;
      }

      const path = `<path d="${d}" fill="none" stroke="${col}" stroke-width="${width}" stroke-linecap="round"/>`;
      if (isFg) fgPaths += path;
      else bgPaths += path;
    });

    svgBg.innerHTML = `<g>${bgPaths}</g>`;
    svgFg.innerHTML = `<g>${fgPaths}</g>`;
  }
}
