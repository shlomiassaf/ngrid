import { Observable } from 'rxjs';

export type DataSourceOf<T> = T[] | Promise<T[]> | Observable<T[]>;
