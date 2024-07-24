import classInstanceProvider from '../classInstanceProvider';
import { Channel } from './channel';
import { EventType } from './event.enum';
import type { ApiEvent, DBEvent, IpcEvent, TrackingEvent, UiEvent } from './event.interface';

const ONE = 1;

export interface EventBusHandler<T extends ApiEvent | DBEvent | IpcEvent | TrackingEvent | UiEvent> {
  onMessage(event: T): void;
}

export class EventBus {
  private readonly apiChannel: Channel<EventType.API, ApiEvent>;

  private readonly apiChannelHandlers: EventBusHandler<ApiEvent>[] = [];

  private readonly dbChannel: Channel<EventType.DB, DBEvent>;

  private readonly dbChannelHandlers: EventBusHandler<DBEvent>[] = [];

  private readonly ipcChannel: Channel<EventType.IPC, IpcEvent>;

  private readonly ipcChannelHandlers: EventBusHandler<IpcEvent>[] = [];

  private readonly trackingChannel: Channel<EventType.TRACKING, TrackingEvent>;

  private readonly trackingChannelHandlers: EventBusHandler<TrackingEvent>[] = [];

  private readonly uiChannel: Channel<EventType.UI, UiEvent>;

  private readonly uiChannelHandlers: EventBusHandler<UiEvent>[] = [];

  constructor() {
    this.apiChannel = new Channel<EventType.API, ApiEvent>(EventType.API.valueOf(), (event) => {
      this.apiChannelHandlers.forEach((ch) => ch.onMessage(event));
    });

    this.dbChannel = new Channel<EventType.DB, DBEvent>(EventType.DB.valueOf(), (event) => {
      this.dbChannelHandlers.forEach((ch) => ch.onMessage(event));
    });

    this.ipcChannel = new Channel<EventType.IPC, IpcEvent>(EventType.IPC.valueOf(), (event) => {
      this.ipcChannelHandlers.forEach((ch) => ch.onMessage(event));
    });

    this.trackingChannel = new Channel<EventType.TRACKING, TrackingEvent>(EventType.TRACKING.valueOf(), (event) => {
      this.trackingChannelHandlers.forEach((ch) => ch.onMessage(event));
    });

    this.uiChannel = new Channel<EventType.UI, UiEvent>(
      EventType.UI.valueOf(),
      (event) => {
        this.uiChannelHandlers.forEach((ch) => ch.onMessage(event));
      },
      true,
    );
  }

  public isApiEventLeader(): boolean {
    return this.apiChannel.isLeader();
  }

  public addApiEventHandler(handler: EventBusHandler<ApiEvent>): void {
    this.apiChannelHandlers.push(handler);
  }

  public removeApiEventHandler(handler: EventBusHandler<ApiEvent>): void {
    const index = this.apiChannelHandlers.findIndex((h) => h === handler);

    this.apiChannelHandlers.splice(index, ONE);
  }

  public broadcastApiEvent(event: ApiEvent): void {
    this.apiChannel.broadcast(event);
    if (!event.noSelf) {
      this.apiChannelHandlers.forEach((ch) => ch.onMessage(event));
    }
  }

  public isDBEventLeader(): boolean {
    return this.dbChannel.isLeader();
  }

  public addDBEventHandler(handler: EventBusHandler<DBEvent>): void {
    this.dbChannelHandlers.push(handler);
  }

  public removeDBEventHandler(handler: EventBusHandler<DBEvent>): void {
    const index = this.dbChannelHandlers.findIndex((h) => h === handler);

    this.dbChannelHandlers.splice(index, ONE);
  }

  public broadcastDBEvent(event: DBEvent): void {
    this.dbChannel.broadcast(event);
    // FIXME: Issue with no self
    // if (!event.noSelf) {
    this.dbChannelHandlers.forEach((ch) => ch.onMessage(event));
    // }
  }

  public isIpcEventLeader(): boolean {
    return this.ipcChannel.isLeader();
  }

  public addIpcEventHandler(handler: EventBusHandler<IpcEvent>): void {
    this.ipcChannelHandlers.push(handler);
  }

  public removeIpcEventHandler(handler: EventBusHandler<IpcEvent>): void {
    const index = this.ipcChannelHandlers.findIndex((h) => h === handler);

    this.ipcChannelHandlers.splice(index, ONE);
  }

  public broadcastIpcEvent(event: IpcEvent): void {
    this.ipcChannel.broadcast(event);
    if (!event.noSelf) {
      this.ipcChannelHandlers.forEach((ch) => ch.onMessage(event));
    }
  }

  public isTrackingEventLeader(): boolean {
    return this.trackingChannel.isLeader();
  }

  public addTrackingEventHandler(handler: EventBusHandler<TrackingEvent>): void {
    this.trackingChannelHandlers.push(handler);
  }

  public removeTrackingEventHandler(handler: EventBusHandler<TrackingEvent>): void {
    const index = this.trackingChannelHandlers.findIndex((h) => h === handler);

    this.trackingChannelHandlers.splice(index, ONE);
  }

  public broadcastTrackingEvent(event: TrackingEvent): void {
    this.trackingChannel.broadcast(event);
    if (!event.noSelf) {
      this.trackingChannelHandlers.forEach((ch) => ch.onMessage(event));
    }
  }

  public isUiEventLeader(): boolean {
    return this.uiChannel.isLeader();
  }

  public addUiEventHandler(handler: EventBusHandler<UiEvent>): void {
    this.uiChannelHandlers.push(handler);
  }

  public removeUiEventHandler(handler: EventBusHandler<UiEvent>): void {
    const index = this.uiChannelHandlers.findIndex((h) => h === handler);

    this.uiChannelHandlers.splice(index, ONE);
  }

  public broadcastUiEvent(event: UiEvent): void {
    this.uiChannel.broadcast(event);
    if (!event.noSelf) {
      this.uiChannelHandlers.forEach((ch) => ch.onMessage(event));
    }
  }
}

export const bus = classInstanceProvider.getInstance(EventBus);
