import type { EventType } from './event.enum';

export interface Event<T> {
  /**
   * The type of event to broadcast
   */
  type: T;

  /**
   * By default all events will be broadcasted to all listeners including the current process.
   * Enable this flag in order to prevent events from reaching the origination process
   */
  noSelf?: boolean;

  /**
   * By default all events will be broadcasted to all listeners including the current process.
   * Enable this flag in order to send the event ONLY to the origination process.
   *
   * NOTE: If this flag is set to true and the noSelf flag is false and if the event is created by the leader,
   * then it will be ignored.
   */
  leaderOnly?: boolean;

  /**
   * Your custom data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export type ApiEvent = Event<EventType.API>;

export type DBEvent = Event<EventType.DB>;

export type TrackingEvent = Event<EventType.TRACKING>;

export type IpcEvent = Event<EventType.IPC>;

export type UiEvent = Event<EventType.UI>;
