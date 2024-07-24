/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IndexableType, IndexableTypePart } from 'dexie';
import type { DBEventType } from './db.enum';

export interface DBTableSchema {
  [key: string]: IndexableType | boolean | boolean[] | undefined | null | Record<any, any>;
}

export interface DBTableIndex {
  [tableName: string]: string | null;
}

export interface DBEventData<TKey extends IndexableTypePart> {
  type: DBEventType;
  keys: TKey[];
  db?: string; // the db and table are present for persistent table store only
  table?: string;
}
