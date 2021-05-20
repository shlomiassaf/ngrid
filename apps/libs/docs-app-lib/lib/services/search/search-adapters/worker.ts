import { Observable } from 'rxjs';

import { SearchWebWorkerMessage, SearchResults } from '../models';
import { SearchAdapter } from './adapter';

export class WorkerSearchAdapter implements SearchAdapter {

  private worker: Worker;
  private nextId = 0;

  constructor() {
    this.worker = new Worker(new URL('../search.worker', import.meta.url), { name: 'searchWorker', type: 'module' });
  }

  loadIndex(searchContent: string): Observable<boolean> {
    return this.sendMessage<boolean>('loadIndex', searchContent);
  };

  queryIndex(query: string): Observable<SearchResults> {
    return this.sendMessage<SearchResults>('queryIndex', query);
  }

  dispose(): void { }

  private sendMessage<T>(type: SearchWebWorkerMessage['type'], payload?: any): Observable<T> {

    return new Observable<T>( subscriber => {

      const id = this.nextId++;

      const handleMessage = (response: MessageEvent) => {
        const {type: responseType, id: responseId, payload: responsePayload} = response.data as SearchWebWorkerMessage;
        if (type === responseType && id === responseId) {
          subscriber.next(responsePayload);
          subscriber.complete();
        }
      };

      const handleError = (error: ErrorEvent) => {
        // Since we do not check type and id any error from the webworker will kill all subscribers
        subscriber.error(error);
      };

      // Wire up the event listeners for this message
      this.worker.addEventListener('message', handleMessage);
      this.worker.addEventListener('error', handleError);

      // Post the message to the web worker
      this.worker.postMessage({type, id, payload});

      // At completion/error unwire the event listeners
      return () => {
        this.worker.removeEventListener('message', handleMessage);
        this.worker.removeEventListener('error', handleError);
      };
    });
  }
}

export default WorkerSearchAdapter;
