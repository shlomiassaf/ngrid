import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, Type } from '@angular/core';
import { Route } from '@angular/router';

export interface ExampleMetadata {
  id: string;
  title: string;
  component: Type<any>;
}

export interface ExampleGroupMap { } // tslint:disable-line
export interface ExampleGroupMetadata {
  id: keyof ExampleGroupMap;
  title: string;
  examples: ExampleMetadata[];
}

@Injectable({ providedIn: 'root' })
export class ExampleGroupRegistryService {
  readonly groups: Observable<ExampleGroupMetadata[]>;
  private readonly groups$: BehaviorSubject<ExampleGroupMetadata[]>;
  private _store = new Map<keyof ExampleGroupMap, ExampleGroupMetadata>();

  constructor() {
    this.groups$ = new BehaviorSubject<ExampleGroupMetadata[]>([]);
    this.groups = this.groups$.asObservable();
  }

  findGroup(groupId: keyof ExampleGroupMap): ExampleGroupMetadata | undefined {
    return this._store.get(groupId);
  }

  getGroups(): ExampleGroupMetadata[] {
    return Array.from(this._store.values());
  }

  registerGroup(metadata: ExampleGroupMetadata): void {
    this._store.set(metadata.id, metadata);
    this.groups$.next(this.getGroups());
  }

  registerGroupFromRoutes(group: { id: keyof ExampleGroupMap; title: string; }, routes: Array<Route & { data: { title: string } }>): void {
    this.registerGroup({
      id: group.id,
      title: group.title,
      examples: routes.map( r => ({ id: r.path, component: r.component, title: r.data.title })),
    });
  }
}
