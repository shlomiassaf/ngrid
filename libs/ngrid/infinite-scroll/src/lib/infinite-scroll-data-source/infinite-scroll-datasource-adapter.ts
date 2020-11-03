import { Observable } from 'rxjs';
import { PblDataSourceAdapter, PblDataSourceConfigurableTriggers } from '@pebula/ngrid';
import { PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { PblInfiniteScrollDSContext } from './infinite-scroll-datasource.context';
import { debounceTime } from 'rxjs/operators';

export class PblInfiniteScrollDataSourceAdapter<T = any, TData = any> extends PblDataSourceAdapter<T, TData, PblInfiniteScrollTriggerChangedEvent<TData>> {

  readonly virtualRowsLoading: Observable<boolean>;

  constructor(private context: PblInfiniteScrollDSContext<T, TData>,
              config: false | Partial<Record<keyof PblDataSourceConfigurableTriggers, boolean>>,
              onVirtualLoading: Observable<boolean>) {
    super(e => context.onTrigger(e), config);
    this.virtualRowsLoading = onVirtualLoading.pipe(debounceTime(24));
  }

  dispose() {
    this.context.dispose();
    super.dispose();
  }

  protected emitOnSourceChanging(event: PblInfiniteScrollTriggerChangedEvent<TData>) {
    if (event.isInitial) {
      super.emitOnSourceChanging(event);
    }
  }
}
