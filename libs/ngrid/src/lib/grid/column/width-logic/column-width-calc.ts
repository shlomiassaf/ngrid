import { animationFrameScheduler, fromEventPattern, Subject } from 'rxjs';
import { debounceTime, skip, takeUntil } from 'rxjs/operators';
import { ON_DESTROY } from '@pebula/ngrid/core';
import { PblNgridInternalExtensionApi } from '../../../ext/grid-ext-api';
import { resetColumnWidths } from '../../utils/width';
import { PblColumn } from '../model/column';
import { PblColumnStore } from '../management/column-store';
import { DynamicColumnWidthLogic, DYNAMIC_PADDING_BOX_MODEL_SPACE_STRATEGY } from './dynamic-column-width';

export class PblNgridColumnWidthCalc {

  readonly dynamicColumnWidth: DynamicColumnWidthLogic;
  readonly onWidthCalc = new Subject<DynamicColumnWidthLogic>();
  private readonly columnStore: PblColumnStore

  constructor(private readonly extApi: PblNgridInternalExtensionApi) {
    this.columnStore = extApi.columnStore;
    this.dynamicColumnWidth = new DynamicColumnWidthLogic(DYNAMIC_PADDING_BOX_MODEL_SPACE_STRATEGY, extApi.getDirection());
    extApi.directionChange()
      .pipe(takeUntil(extApi.events.pipe(ON_DESTROY)))
      .subscribe( dir => this.dynamicColumnWidth.dir = dir );

    extApi.events.pipe(ON_DESTROY).subscribe(() => this.onWidthCalc.complete() );

    extApi.onInit(() => this.listenToResize() );
  }

  /**
   * Updates the column sizes for all columns in the grid based on the column definition metadata for each column.
   * The final width represent a static width, it is the value as set in the definition (except column without width, where the calculated global width is set).
   */
  resetColumnsWidth(): void {
    resetColumnWidths(this.columnStore.getStaticWidth(), this.columnStore.visibleColumns, this.columnStore.metaColumns);
  }

  calcColumnWidth(columns?: PblColumn[]): void {
    if (!columns) {
      columns = this.columnStore.visibleColumns;
    }

    // protect from per-mature resize.
    // Will happen on additional header/header-group rows AND ALSO when vScrollNone is set
    // This will cause size not to populate because it takes time to render the rows, since it's not virtual and happens immediately.
    // TODO: find a better protection.
    if (!columns[0]?.sizeInfo) {
      return;
    }

    // stores and calculates width for columns added to it. Aggregate's the total width of all added columns.
    const rowWidth = this.dynamicColumnWidth;
    rowWidth.reset();
    this.syncColumnGroupsSize();

    // if this is a grid without groups
    if (rowWidth.minimumRowWidth === 0) {
      // - We filter at the end because on add column we will have a column that still didn't get the resize event hence not having the size info
      // We will ignore it because once it will get it a new resize event is triggered
      rowWidth.addGroup(columns.map( c => c.sizeInfo ).filter( c => !!c ));
    }

    // if the max lock state has changed we need to update re-calculate the static width's again.
    if (rowWidth.maxWidthLockChanged) {
      this.resetColumnsWidth();
      this.calcColumnWidth(columns);
      return;
    }

    this.onWidthCalc.next(rowWidth);
  }

  /**
   * Update the size of all group columns in the grid based on the size of their visible children (not hidden).
   * @param dynamicWidthLogic - Optional logic container, if not set a new one is created.
   */
  private syncColumnGroupsSize(): void {
    // From all meta columns (header/footer/headerGroup) we filter only `headerGroup` columns.
    // For each we calculate it's width from all of the columns that the headerGroup "groups".
    // We use the same strategy and the same RowWidthDynamicAggregator instance which will prevent duplicate calculations.
    // Note that we might have multiple header groups, i.e. same columns on multiple groups with different row index.
    for (const g of this.columnStore.getAllHeaderGroup()) {
      // - We go over all columns because g.columns does not represent the current owned columns of the group it is static, representing the initial state.
      // Only columns hold their group owners.
      // - We filter at the end because on add column we will have a column that still didn't get the resize event hence not having the size info
      // We will ignore it because once it will get it a new resize event is triggered
      // TODO: find way to improve iteration
      const colSizeInfos = this.columnStore.visibleColumns.filter( c => !c.hidden && c.isInGroup(g)).map( c => c.sizeInfo ).filter( c => !!c );
      if (colSizeInfos.length > 0) {
        const groupWidth = this.dynamicColumnWidth.addGroup(colSizeInfos);
        g.minWidth = groupWidth;
        g.updateWidth(`${groupWidth}px`);
      } else {
        g.minWidth = undefined;
        g.updateWidth(`0px`);
      }
    }
  }

  private listenToResize(): void {
    const { element } = this.extApi;
    let resizeObserver: ResizeObserver;
    const ro$ = fromEventPattern<[ResizeObserverEntry[], ResizeObserver]>(
      handler => {
        if (!resizeObserver) {
          resizeObserver = new ResizeObserver(handler);
          resizeObserver.observe(element);
        }
      },
      handler => {
        if (resizeObserver) {
          resizeObserver.unobserve(element);
          resizeObserver.disconnect();
          resizeObserver = undefined;
        }
      }
    );

    // Skip the first emission
    // Debounce all resizes until the next complete animation frame without a resize
    // finally maps to the entries collection
    // SKIP:  We should skip the first emission (`skip(1)`) before we debounce, since its called upon calling "observe" on the resizeObserver.
    //        The problem is that some grid might require this because they do change size.
    //        An example is a grid in a mat-tab that is hidden, the grid will hit the resize one when we focus the tab
    //        which will require a resize handling because it's initial size is 0
    //        To workaround this, we only skip elements not yet added to the DOM, which means they will not trigger a resize event.
    let skipValue = document.body.contains(element) ? 1 : 0;

    ro$
      .pipe(
        skip(skipValue),
        debounceTime(0, animationFrameScheduler),
        takeUntil(this.extApi.events.pipe(ON_DESTROY)),
      )
      .subscribe( (args: [ResizeObserverEntry[], ResizeObserver]) => {
        if (skipValue === 0) {
          skipValue = 1;
          this.extApi.columnStore.visibleColumns.forEach( c => c.sizeInfo.updateSize() );
        }
        this.onResize(args[0]);
      });
  }

  private onResize(entries: ResizeObserverEntry[]): void {
    this.extApi.viewport?.checkViewportSize();
    this.calcColumnWidth();
  }
}
