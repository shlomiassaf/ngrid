/// <reference path="./service-worker" />
import { Customer, Person, Seller } from './models';

export type DATA_TYPES = 'customers' | 'people' | 'sellers';

declare module './shared' {
  export interface ClientProtocol {
    reset: {
      request: {
        type: Array<DATA_TYPES>;
      }
      response: void;
    },
    getCustomers: {
      request: {
        limit?: number;
        delay?: number;
      };
      response: Customer[];
    };
    getPeople: {
      request: {
        limit?: number;
        delay?: number;
      };
      response: Person[];
    };
    getSellers: {
      request: {
        limit?: number;
        delay?: number;
      };
      response: Seller[];
    };
  }

  export interface ServerProtocol {
    dummy: {
      request: { };
      response: void;
    };
  }
}
