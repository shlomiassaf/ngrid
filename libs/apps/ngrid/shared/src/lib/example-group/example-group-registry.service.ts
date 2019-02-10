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
  title?: string;
  examples: ExampleDemoItem[];
}

export class ExampleDemoItem implements ExampleMetadata {
  id: string;
  title: string;
  component: Type<any>;
  readonly routerLink: string[];

  constructor(groupId: string, route: Route, data: { title: string }, pathPrefix?: string) {
    this.id = route.path;
    this.component = route.component;
    this.title = data.title;
    this.routerLink = [
      './',
      ...(pathPrefix ? [pathPrefix] : []),
      this.id,
    ];
  }
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

  registerGroup(metadata: Pick<ExampleGroupMetadata, 'id' | 'title'>): void {
    this._store.set(metadata.id, { ...metadata, examples: [] });
    this.groups$.next(this.getGroups());
  }

  addToGroup(groupId: keyof ExampleGroupMap, ...examples: ExampleDemoItem[]): void {
    const m = this._store.get(groupId);
    m.examples = [...m.examples, ...examples];
    this.groups$.next(this.getGroups());
  }

  registerSubGroupRoutes(groupId: keyof ExampleGroupMap,
                         routes: Array<Route & { data?: { title: string } }>,
                         pathPrefix?: string): void {
    this.addToGroup(
      groupId,
      ...routes.filter( r => !!r.data ).map( r => new ExampleDemoItem(groupId, r, r.data, pathPrefix) ),
    );
  }
}
