import { BroadcastChannel, createLeaderElection } from 'broadcast-channel';
import type { LeaderElector } from 'broadcast-channel';

import type { OnMessageHandler } from 'broadcast-channel';
import type { Event } from './event.interface';

export type ChannelHandler<T, E extends Event<T>> = (this: Channel<T, E>, event: E) => void;

export class Channel<T, E extends Event<T>> extends BroadcastChannel<E> {
  private readonly elector: LeaderElector;

  private readonly onMessageHandler: OnMessageHandler<E>;

  constructor(
    readonly name: string,
    private readonly handler: ChannelHandler<T, E>,
    private readonly disableWebWorkerSupport?: boolean,
  ) {
    super(name, { webWorkerSupport: !disableWebWorkerSupport });

    this.onMessageHandler = (event): void => {
      if (event.leaderOnly) {
        if (this.isLeader()) {
          this.handler(event);
        }
      } else {
        this.handler(event);
      }
    };

    this.addEventListener('message', this.onMessageHandler);

    this.elector = createLeaderElection(this);
    this.elector.awaitLeadership();
  }

  public closeChannel(): void {
    this.removeEventListener('message', this.onMessageHandler);
    this.elector.die();
    this.close();
  }

  public broadcast(event: E): void {
    this.postMessage(event);
  }

  public isLeader(): boolean {
    return this.elector.isLeader;
  }

  public token(): string {
    return this.elector.token;
  }

  public isDead(): boolean {
    return this.elector.isDead;
  }
}
