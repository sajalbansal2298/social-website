/* eslint-disable no-dupe-class-members,@typescript-eslint/unified-signatures,@typescript-eslint/indent */
import store from 'store2';
import type { StoreAPI } from 'store2';

import { bus, EventType } from '@/tools';
import { DBEventType, CacheStorage } from '.';
import classInstanceProvider from '../classInstanceProvider';

export const CACHE_NAMESPACE = 'learnapp-cache';

export class DBCache {
  private readonly memory: StoreAPI;

  private readonly session: StoreAPI;

  private readonly persistent: StoreAPI;

  /**
   * Create a new database table
   *
   * @param namespace The namespace for the cache
   */
  constructor(protected readonly namespace = CACHE_NAMESPACE) {
    this.memory = store.page.namespace(namespace);
    this.session = store.session.namespace(namespace);
    this.persistent = store.local.namespace(namespace);
  }

  /**
   * Get the item from the cache
   *
   * @param [storage] cache storage type, defaults to persistent storage
   */
  public async get<T>(key: string, storage: CacheStorage = CacheStorage.PERSISTENT): Promise<T> {
    switch (storage) {
      case CacheStorage.MEMORY:
        return this.memory.get(key);
      case CacheStorage.SESSION:
        return this.session.get(key);
      default:
      case CacheStorage.PERSISTENT:
        return this.persistent.get(key);
    }
  }

  /**
   * Insert or replace items into the cache.
   *
   * NOTE: If the storage is set to PERSISTENT type then an event will be broadcasted to all listeners apart from self.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.CACHE_INVALIDATION,
   *      keys: key,
   *    },
   *  }
   *
   * @param key cache key
   * @param data cache data
   * @param [storage] cache storage type, defaults to persistent storage
   */
  public async insert<T>(key: string, data: T, storage: CacheStorage = CacheStorage.PERSISTENT): Promise<void> {
    switch (storage) {
      case CacheStorage.MEMORY:
        this.memory.set(key, data);
        break;
      case CacheStorage.SESSION:
        this.session.set(key, data);
        break;
      default:
      case CacheStorage.PERSISTENT:
        console.log('Bus', this);
        this.persistent.set(key, data);
        bus.broadcastDBEvent({
          type: EventType.DB,
          noSelf: true,
          data: {
            type: DBEventType.CACHE_INVALIDATION,
            keys: [key],
          },
        });
        break;
    }
  }

  /**
   * Delete one or more cache items
   *
   * NOTE: If the storage is set to PERSISTENT type then an event will be broadcasted to all listeners apart from self.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.CACHE_INVALIDATION,
   *      keys: key,
   *    },
   *  }
   *
   * @param key keys to delete
   * @param [storage] cache storage type, defaults to persistent storage
   */
  public async remove(key: string | string[], storage: CacheStorage = CacheStorage.PERSISTENT): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];

    switch (storage) {
      case CacheStorage.MEMORY:
        keys.forEach(this.memory.remove.bind(this.memory));
        break;
      case CacheStorage.SESSION:
        keys.forEach(this.session.remove.bind(this.session));
        break;
      default:
      case CacheStorage.PERSISTENT:
        keys.forEach(this.persistent.remove.bind(this.persistent));
        bus.broadcastDBEvent({
          type: EventType.DB,
          noSelf: true,
          data: {
            type: DBEventType.CACHE_INVALIDATION,
            keys,
          },
        });
        break;
    }
  }

  /**
   * Clear the cache
   *
   * NOTE: If the storage is set to PERSISTENT type then an event will be broadcasted to all listeners apart from self.
   * The broadcasted event will be of the following format:
   *
   *  {
   *    type: EventType.DB,
   *    noSelf: true,
   *    data: {
   *      type: DBEventType.CACHE_INVALIDATION,
   *      keys: key,
   *    },
   *  }
   *
   * @param [storage] cache storage type, defaults to persistent storage
   */
  public async clear(storage: CacheStorage = CacheStorage.PERSISTENT): Promise<void> {
    let keys;

    switch (storage) {
      case CacheStorage.MEMORY:
        keys = this.memory.keys();
        this.memory.clearAll();
        break;
      case CacheStorage.SESSION:
        keys = this.session.keys();
        this.session.clearAll();
        break;
      default:
      case CacheStorage.PERSISTENT:
        keys = this.persistent.keys();
        this.persistent.clearAll();
        bus.broadcastDBEvent({
          type: EventType.DB,
          noSelf: true,
          data: {
            type: DBEventType.CACHE_INVALIDATION,
            keys,
          },
        });
        break;
    }
  }

  /**
   * Count the number of items in the cache
   *
   * @param [storage] cache storage type, defaults to persistent storage
   */
  public async count(storage: CacheStorage = CacheStorage.PERSISTENT): Promise<number> {
    switch (storage) {
      case CacheStorage.MEMORY:
        return this.memory.size();
      case CacheStorage.SESSION:
        return this.session.size();
      default:
      case CacheStorage.PERSISTENT:
        return this.persistent.size();
    }
  }
}

export const cache = classInstanceProvider.getInstance(DBCache);
