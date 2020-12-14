import { Observable, of, Subject } from 'rxjs';
import { filter, take, mapTo } from 'rxjs/operators';

import { PblNgridEventsMap, PblNgridEvents } from './ngrid-events';

const eventFilterFactory = <T extends keyof PblNgridEventsMap>(kind: T) => (o: Observable<PblNgridEvents>) => o.pipe(filter( e => e.kind === kind )) as Observable<PblNgridEventsMap[T]>;
const once = <T>(pipe: (o: Observable<PblNgridEvents>) => Observable<T>) => (o: Observable<PblNgridEvents>) => pipe(o).pipe(take(1));

export const ON_CONSTRUCTED = once(eventFilterFactory('onConstructed'));
export const ON_INIT = once(eventFilterFactory('onInit'));
export const ON_DESTROY = once(eventFilterFactory('onDestroy'));
export const ON_BEFORE_INVALIDATE_HEADERS = eventFilterFactory('beforeInvalidateHeaders');
export const ON_INVALIDATE_HEADERS = eventFilterFactory('onInvalidateHeaders');
export const ON_RESIZE_ROW = eventFilterFactory('onResizeRow');
