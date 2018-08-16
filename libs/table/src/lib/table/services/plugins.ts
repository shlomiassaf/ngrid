import { Subject } from 'rxjs';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { SgTableComponent } from '../table.component';

export const Notify = {
  onNewTable: new Subject<SgTableComponent<any>>(),
};

/**
 * The external plugin service is a service that allows external access into the table
 * without using conventional angular practices (i.e. without components/directives/templates/etc)
 */
@Injectable({
  providedIn: 'root',
})
export class SgTableExternalPluginService {
  readonly onNewTable = Notify.onNewTable.asObservable();
}
