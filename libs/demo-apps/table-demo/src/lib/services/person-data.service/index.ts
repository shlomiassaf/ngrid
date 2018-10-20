import { of, Observable, Subject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Person {
  id: number;
  name: string;
  email: string;
  gender: 'Male' | 'Female';
  country: string;
  birthdate: string;
  bio: string;
  language: string;
  lead: boolean;
  balance: number;
  settings: {
    background: string;
    timezone: string;
    emailFrequency: 'Daily' | 'Weekly' | 'Yearly' | 'Often' | 'Seldom' | 'Never';
    avatar: string;
  };
  lastLoginIp: string;
}

let persondb: Person[];
let countryData: any;

export function getPersons(delayTime = 1000): Observable<Person[]> {
  if (!persondb) {
    const s = new Subject<Person[]>();
    require.ensure([], () => {
      countryData = require('country-data');
      persondb = require('./persons.json');
      s.next(persondb);
    });
    return s.pipe(delay(delayTime));
  } else {
    return of(persondb).pipe(delay(delayTime));
  }
}

export function getCountryData(): Observable<any> {
  if (!countryData) {
    return getPersons().pipe(map( () => countryData ));
  } else {
    return of(countryData);
  }
}
