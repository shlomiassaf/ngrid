import { Injectable } from '@angular/core';

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

@Injectable({ providedIn: 'root' })
export class DemoDataSource {

  private cache: Person[] = [];

  getPeopleSync(limit = 500): Person[] {
    return this.cache.slice(0, limit);
  }

  getPeople(delay = 1000, limit = 500): Promise<Person[]> {
    return this.getCountries()
      .then( () => this.wait(delay) )
      .then( () => import('faker'))
      .then( faker => {
        if (this.cache.length < limit - 1) {
          for (let i = this.cache.length; i < limit; i++) {
            const p: Person = {
              id: i,
              name: faker.name.findName(),
              email: faker.internet.email(),
              gender: faker.random.arrayElement(['Male', 'Female'] as  ['Male', 'Female']),
              country: faker.address.countryCode(),
              birthdate: faker.date.past().toISOString(),
              bio: faker.lorem.paragraph(),
              language: 'EN',
              lead: faker.random.boolean(),
              balance: faker.random.number({ min: -20000, max: 20000, precision: 2 }),
              settings: {
                background: faker.internet.color(),
                timezone: 'UTC',
                emailFrequency: faker.random.arrayElement(['Daily', 'Weekly', 'Yearly', 'Often', 'Seldom', 'Never'] as  ['Daily', 'Weekly', 'Yearly', 'Often', 'Seldom', 'Never']),
                avatar: faker.image.avatar(),
              },
              lastLoginIp: faker.internet.ip()
            }
            this.cache.push(p);
          }
        }
        return this.cache.slice(0, limit);
      });
  }

  getCountries(delay = 0) {
    return this.wait(delay)
    .then( () => import('country-data') );
  }

  private wait(time: number): Promise<void> {
    return new Promise( resolve => {
      setTimeout(resolve, time);
    });
  }
}
