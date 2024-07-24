// eslint-disable-next-line no-shadow
export enum DBEventType {
  INSERT,
  UPDATE,
  REMOVE,
  CLEAN,
  TABLE_UPGRADE,
  CACHE_INVALIDATION,
}

// eslint-disable-next-line no-shadow
export enum CacheStorage {
  MEMORY,
  SESSION,
  PERSISTENT,
}
