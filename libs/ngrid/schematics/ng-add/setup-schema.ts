import { Schema } from './schema';

export interface SetupSchema extends Schema {
  externalSchematics: string[]
}
