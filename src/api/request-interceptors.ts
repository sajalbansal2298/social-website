/* eslint-disable @typescript-eslint/no-explicit-any */
import { bus, RestApi, EventType } from '@/tools';

interface ApiEvent {
  apiTriggered?: boolean;
}

export type RequestInterceptorCallback = () => void;

export type ResponseInterceptorCallback = () => void;

export class RequestInterceptor extends RestApi {
  private reqInterceptorCallback!: RequestInterceptorCallback;

  private resInterceptorCallback!: RequestInterceptorCallback;

  constructor(url: string, apiKey: string) {
    super(url, apiKey);
    this.intializeInterceptors();
  }

  intializeInterceptors(): void {
    this.reqInterceptorCallback = (): void => {
      const eventData: ApiEvent = { apiTriggered: true };

      bus.broadcastUiEvent({
        type: EventType.UI,
        leaderOnly: true,
        data: eventData,
      });
    };

    this.resInterceptorCallback = (): void => {
      const eventData: ApiEvent = { apiTriggered: false };

      bus.broadcastUiEvent({
        type: EventType.UI,
        leaderOnly: true,
        data: eventData,
      });
    };
    this.registerReqInterceptor(this.reqInterceptorCallback);
    this.registerResInterceptor(this.resInterceptorCallback);
  }
}
