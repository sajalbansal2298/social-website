/* eslint-disable no-dupe-class-members,@typescript-eslint/unified-signatures,max-lines */
import type { Table, IndexableTypePart, Collection, WhereClause } from 'dexie';

import { bus, EventBus, EventType } from '@/tools';

import type { DBEvent, DBEventData, EventBusHandler } from '@/tools';

import { DB, DBEventType } from './';
import type { DBTableSchema } from './';

export abstract class DBTable<TSchema extends DBTableSchema, TKey extends IndexableTypePart> {
  protected readonly bus!: EventBus;

  private dbEventHandler?: EventBusHandler<DBEvent>;

  /**
   * Create a new database table
   *
   * @param tableName The table name
   * @param [db] The database instance
   */
  constructor(protected readonly tableName: string, protected readonly db: DB) {}

  public addDBEventHandler(onMessage: (event: DBEvent) => void): void {
    this.dbEventHandler = {
      onMessage: (event: DBEvent): void => {
        const data = event.data as DBEventData<TKey>;

        if (data.table === this.tableName || data.type === DBEventType.CACHE_INVALIDATION) {
          onMessage(event);
        }
      },
    };
    bus.addDBEventHandler(this.dbEventHandler);
  }

  public removeDBEventHandler(): void {
    if (this.dbEventHandler) {
      bus.removeDBEventHandler(this.dbEventHandler);
    }
  }

  /**
   * Open a connection to the database
   */
  public connect(): void {
    this.db.open();
  }

  /**
   * Map a class with the table
   *
   * @param impl The class implementing the DBSchema
   */
  public mapToClass(impl: new () => TSchema): void {
    this.getTable().mapToClass(impl);
  }

  /**
   * Get the underlying raw table
   */
  public getTable(): Table<TSchema, TKey> {
    return this.db.table(this.tableName);
  }

  /**
   * Find all items in the table
   */
  public async find(): Promise<TSchema[]>;

  /**
   * Get multiple items at once using their primary key identifiers
   *
   * @param keys list of keys
   */
  public async find(keys: TKey[]): Promise<TSchema[]>;

  /**
   * Get all items in a given order
   *
   * @param orderBy ordering criteria
   */
  public async find(orderBy: string): Promise<TSchema[]>;

  /**
   * Get items that matches the filter
   *
   * @param filterBy filtering criteria
   */
  public async find(filterBy: (x: TSchema) => boolean): Promise<TSchema[]>;

  /**
   * Get all items up to the given limit
   *
   * @param limit limiting criteria
   */
  public async find(limit: number): Promise<TSchema[]>;

  /**
   * Get all items up to the given limit and after a given offset
   *
   * @param limit limiting criteria
   * @param offset offset criteria
   */
  public async find(limit: number, offset: number): Promise<TSchema[]>;

  /**
   * Get all items up to the given limit and after a given offset in a given order
   *
   * @param limit limiting criteria
   * @param offset offset criteria
   * @param orderBy ordering criteria
   */
  public async find(limit: number, offset: number, orderBy: string): Promise<TSchema[]>;

  /**
   * Get all items matching the given filter and
   * up to the given limit and after a given offset in a given order
   *
   * @param limit limiting criteria
   * @param offset offset criteria
   * @param orderBy ordering criteria
   * @param filterBy filtering criteria
   */
  public async find(
    limit: number,
    offset: number,
    orderBy: string,
    filterBy: (x: TSchema) => boolean,
  ): Promise<TSchema[]>;

  /**
   * Get all items matching the given filter and
   * up to the given limit and after a given offset in a given order
   *
   * @param param1 undefined | list of keys | limiting criteria | filtering criteria | ordering criteria
   * @param offset offset criteria
   * @param orderBy ordering criteria
   * @param filterBy filtering criteria
   */
  public async find(
    param1?: TKey[] | number | string | ((f: TSchema) => boolean),
    offset?: number,
    orderBy?: string,
    filterBy?: (x: TSchema) => boolean,
  ): Promise<(TSchema | undefined)[]> {
    if (!this.db.isOpen()) {
      this.connect();
    }

    let q: Collection<TSchema, TKey> = orderBy ? this.getTable().orderBy(orderBy) : this.getTable().toCollection();

    // if no params are passed, get all items
    if (!param1) {
      return q.toArray();
    }
    // first param is list of keys to fetch
    if (Array.isArray(param1)) {
      return this.getTable().bulkGet(param1);
    }
    // first param is the limiting criteria
    if (typeof param1 === 'number') {
      q = q.limit(param1);
    } else if (typeof param1 === 'string') {
      // first param is the ordering criteria
      q = this.getTable().orderBy(param1);
    } else {
      // first param is the filtering criteria
      q = q.filter(param1);
    }

    if (offset) {
      q = q.offset(offset);
    }
    if (filterBy) {
      q = q.filter(filterBy);
    }

    return Promise.resolve(q.toArray());
  }

  /**
   * Get an item its key
   *
   * @param key the primary key identifier
   */
  public async findOne(key: TKey | Record<string, IndexableTypePart>): Promise<TSchema | undefined> {
    if (!this.db.isOpen()) {
      this.connect();
    }

    if (
      key instanceof Date ||
      key instanceof ArrayBuffer ||
      key instanceof DataView ||
      typeof key === 'string' ||
      typeof key === 'number'
    ) {
      return this.getTable().get(key as TKey);
    }

    return this.getTable()
      .where(key as Record<string, TKey>)
      .first();
  }

  public query(indexName: string): WhereClause<TSchema, TKey> {
    return this.getTable().where(indexName);
  }

  /**
   * Insert items into the table
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item items to insert
   */
  public async insert(item: TSchema[]): Promise<TKey[]>;

  /**
   * Insert an item
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item item to insert
   */
  public async insert(item: TSchema): Promise<TKey>;

  /**
   * Insert or replace items into the table
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT | DBEventType.UPDATE, // depending on whether data was inserted or updated
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item items to insert
   * @param replace flag whether to replace or not
   */
  public async insert(item: TSchema[], replace: boolean): Promise<TKey[]>;

  /**
   * Insert or replace an item
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT | DBEventType.UPDATE, // depending on whether data was inserted or updated
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item item to insert
   * @param replace whether to replace or not
   */
  public async insert(item: TSchema, replace: boolean): Promise<TKey>;

  /**
   * Insert items into the table
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item items to insert
   * @param keys array of primary keys that corresponds to given items array
   */
  public async insert(item: TSchema[], keys: TKey[]): Promise<TKey[]>;

  /**
   * Insert an item
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT
   *      db: databaseName,
   *      table: tableName,
   *      keys: [key],
   *    }
   *  }
   *
   * @param item item to insert
   * @param key the primary key
   */
  public async insert(item: TSchema, key: TKey): Promise<TKey>;

  /**
   * Insert or replace items into the table
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT | DBEventType.UPDATE, // depending on whether data was inserted or updated
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item items to insert
   * @param keys array of primary keys that corresponds to given items array
   * @param replace flag whether to replace or not
   */
  public async insert(item: TSchema[], keys: TKey[], replace: boolean): Promise<TKey>;

  /**
   * Insert or replace an item
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT | DBEventType.UPDATE, // depending on whether data was inserted or updated
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item item to insert
   * @param key the primary key
   * @param replace whether to replace or not
   */
  public async insert(item: TSchema, key: TKey, replace: boolean): Promise<TKey>;

  /**
   * Insert or replace items into the table
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful insert.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.INSERT | DBEventType.UPDATE, // depending on whether data was inserted or updated
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param item items to insert
   * @param param keys | replace
   * @param replace flag whether to replace or not
   */
  public async insert(
    items: TSchema | TSchema[],
    param?: TKey | TKey[] | boolean,
    replace?: boolean,
  ): Promise<TKey | TKey[]> {
    if (!this.db.isOpen()) {
      this.connect();
    }

    let returnKeys: TKey | TKey[] = [];
    let dbEventType: DBEventType = DBEventType.INSERT;

    // Bulk operations
    if (Array.isArray(items)) {
      // empty parameters or false
      if (!param) {
        returnKeys = await this.getTable().bulkAdd(items, undefined, {
          allKeys: true,
        });
        dbEventType = DBEventType.INSERT;
      } else if (typeof param === 'boolean' && param) {
        // param is boolean indicating whether to update or insert
        returnKeys = await this.getTable().bulkPut(items, undefined, {
          allKeys: true,
        });
        dbEventType = DBEventType.UPDATE;
      } else {
        // param is the keys
        // if keys are not array, then its a mistake and we should throw an error
        if (!Array.isArray(param)) {
          throw new Error('both items and keys must be an array');
        }

        if (replace) {
          returnKeys = await this.getTable().bulkPut(items, param as TKey[], {
            allKeys: true,
          });
          dbEventType = DBEventType.UPDATE;
        } else {
          returnKeys = await this.getTable().bulkAdd(items, param as TKey[], {
            allKeys: true,
          });
          dbEventType = DBEventType.INSERT;
        }
      }
    } else {
      // Normal single item operations
      // eslint-disable-next-line no-lonely-if
      if (!param) {
        returnKeys = await this.getTable().add(items);
        dbEventType = DBEventType.INSERT;
      } else if (typeof param === 'boolean' && param) {
        returnKeys = await this.getTable().put(items);
        dbEventType = DBEventType.UPDATE;
      } else {
        if (Array.isArray(param)) {
          throw new Error('key must not be an array');
        }
        if (replace) {
          returnKeys = await this.getTable().put(items, param);
          dbEventType = DBEventType.UPDATE;
        } else {
          returnKeys = await this.getTable().add(items, param);
          dbEventType = DBEventType.INSERT;
        }
      }
    }

    bus.broadcastDBEvent({
      type: EventType.DB,
      noSelf: true,
      data: {
        type: dbEventType,
        db: this.db.dbName,
        table: this.tableName,
        keys: Array.isArray(returnKeys) ? returnKeys : [returnKeys],
      },
    });

    return returnKeys;
  }

  /**
   * Delete items
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful remove.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.REMOVE
   *      db: databaseName,
   *      table: tableName,
   *      keys: keys,
   *    }
   *  }
   *
   * @param keys keys to delete
   */
  public async remove(keys: TKey | TKey[]): Promise<void> {
    if (!this.db.isOpen()) {
      this.connect();
    }

    if (Array.isArray(keys)) {
      await this.getTable().bulkDelete(keys as TKey[]);
    }
    await this.getTable().delete(keys as TKey);

    bus.broadcastDBEvent({
      type: EventType.DB,
      noSelf: true,
      data: {
        type: DBEventType.REMOVE,
        db: this.db.dbName,
        table: this.tableName,
        keys: Array.isArray(keys) ? keys : [keys],
      },
    });
  }

  /**
   * Clear the database table
   *
   * NOTE: An event will be broadcasted to all listeners apart from self upon successful clear.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: { type: DBEventType.CLEAN, db: this.dbName, table: this.tableName }
   *  }
   */
  public async clear(): Promise<void> {
    if (!this.db.isOpen()) {
      this.connect();
    }

    await this.getTable().clear();

    bus.broadcastDBEvent({
      type: EventType.DB,
      noSelf: true,
      data: {
        type: DBEventType.CLEAN,
        db: this.db.dbName,
        table: this.tableName,
      },
    });
  }

  /**
   * Count the number of items in the table
   */
  public async count(): Promise<number> {
    if (!this.db.isOpen()) {
      this.connect();
    }

    return this.getTable().count();
  }
}
