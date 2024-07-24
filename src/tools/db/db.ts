import Dexie from 'dexie';

import { dbName, dbVersion, schema } from '@/config';

import classInstanceProvider from '../classInstanceProvider';

import type { DBTableIndex } from './db.interface';

export const ZERO = 0;
export const ONE = 1;

export class DB extends Dexie {
  /**
   *
   * @param dbName The database name
   * @param dbVersion The database version
   * @param schema The database schema with all table definition
   *
   *
   * The schema consists of a table name and table indices for the base version of the database
   *
   * Table index can be:
   *
   *                  `++`	Auto-incremented primary key
   *
   *                  `&`	Unique index
   *
   *                  `*`	Multi-entry index
   *
   *                  `[A+B]`	Compound index or primary key
   *
   * WARNING!!
   * Never index properties containing images, movies or large (huge) strings.
   * Store them in IndexedDB, yes! but just don’t index them!
   * Are you going to put your property in a where(‘…’) clause? If yes, index it, if not, don't.
   */
  constructor(
    public readonly dbName: string,
    protected readonly dbVersion: number,
    protected readonly schema: DBTableIndex,
  ) {
    super(dbName, { allowEmptyDB: true, autoOpen: true });

    this.version(dbVersion).stores(schema);
  }
}

export const dbTable = classInstanceProvider.getInstance(DB, dbName, dbVersion, schema);
