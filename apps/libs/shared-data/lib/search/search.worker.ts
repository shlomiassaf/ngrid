/// <reference lib="webworker" />

import { SearchEngine } from './search-engine';
import { SearchWebWorkerMessage } from './models';

const _self: Worker = <any>self;
_self.onmessage = handleMessage;

let searchEngine: SearchEngine;

function handleMessage(message: { data: SearchWebWorkerMessage }) {
  const { type, id, payload } = message.data;

  switch(type) {
    case 'loadIndex':
      if (!searchEngine) {
        searchEngine = new SearchEngine(payload);
      }
      searchEngine.loadIndex()
        .then( () => _self.postMessage({ type, id, payload: true }))
        .catch( error => _self.postMessage({ type, id, payload: { error } }) );
      break;
    case 'queryIndex':
        _self.postMessage({type: type, id: id, payload: {query: payload, results: searchEngine.queryIndex(payload)}});
      break;
    default:
        _self.postMessage({type: type, id: id, payload: {error: 'invalid message type'}})
  }
}
