/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpApi } from './http-api';
import type { RequestBody } from './fetch.worker';
import { cache } from '@/tools';

const ARR_INDEX_INTIAL = -1;
const ARR_SPLICE_COUNT = 1;

export type RequestInterceptorCallback = () => void;

export type ResponseInterceptorCallback = () => void;

export abstract class RestApi {
  public readonly requestinterceptors: RequestInterceptorCallback[] = [];

  public readonly responseinterceptors: RequestInterceptorCallback[] = [];

  private readonly defaultHeaders: Record<string, string>;

  private baseUrl!: string;

  constructor(url: string, apiKey: string) {
    this.defaultHeaders = { 'content-type': 'application/json' };

    if (url) {
      this.baseUrl = url;
    }
    if (apiKey) {
      this.defaultHeaders['x-api-key'] = apiKey;
    }
  }

  public registerReqInterceptor(callback: RequestInterceptorCallback): void {
    if (!this.requestinterceptors.includes(callback)) {
      this.requestinterceptors.push(callback);
    }
  }

  public unRegisterReqInterceptor(callback: RequestInterceptorCallback): void {
    const idx = this.requestinterceptors.findIndex((cb: RequestInterceptorCallback) => cb === callback);

    if (idx > ARR_INDEX_INTIAL) {
      this.requestinterceptors.splice(idx, ARR_SPLICE_COUNT);
    }
  }

  public registerResInterceptor(callback: RequestInterceptorCallback): void {
    if (!this.responseinterceptors.includes(callback)) {
      this.responseinterceptors.push(callback);
    }
  }

  public unRegisterResInterceptor(callback: RequestInterceptorCallback): void {
    const idx = this.responseinterceptors.findIndex((cb: RequestInterceptorCallback) => cb === callback);

    if (idx > ARR_INDEX_INTIAL) {
      this.responseinterceptors.splice(idx, ARR_SPLICE_COUNT);
    }
  }

  public async setAuthorization(uri: string | undefined, token?: string): Promise<void> {
    const accessToken = await cache.get('TOKEN');

    if (accessToken) {
      this.defaultHeaders.authorization = `Bearer ${accessToken}`;
    } else if (token) {
      this.defaultHeaders.authorization = `Bearer ${token}`;
    }
  }

  public async delete<T>(uri: string, headers?: Record<string, string>, controller?: AbortController): Promise<T> {
    this.requestinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });
    await this.setAuthorization(uri);

    const payload = await httpApi.delete(
      `${this.baseUrl}${uri}`,
      { ...this.defaultHeaders, ...(headers || {}) },
      controller,
    );

    this.responseinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    return payload;
  }

  public async get<T>(uri: string, headers?: Record<string, string>, controller?: AbortController): Promise<T> {
    this.requestinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    await this.setAuthorization(uri);

    const payload = await httpApi.get(
      `${this.baseUrl}${uri}`,
      { ...this.defaultHeaders, ...(headers || {}) },
      controller,
    );

    this.responseinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    return payload;
  }

  public async patch<T>(
    uri: string,
    body?: RequestBody,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<T> {
    this.requestinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    await this.setAuthorization(uri);

    const payload = await httpApi.patch(
      `${this.baseUrl}${uri}`,
      body ? JSON.stringify(body) : null,
      { ...this.defaultHeaders, ...(headers || {}) },
      controller,
    );

    this.responseinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    return payload;
  }

  public async post<T>(
    uri: string,
    body?: Record<string, any>,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<T> {
    this.requestinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });
    await this.setAuthorization(uri);

    const payload = await httpApi.post(
      `${this.baseUrl}${uri}`,
      body ? JSON.stringify(body) : null,
      { ...this.defaultHeaders, ...(headers || {}) },
      controller,
    );

    this.responseinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    return payload;
  }

  public async put<T>(
    uri: string,
    body?: Record<string, any>,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<T> {
    this.requestinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });
    await this.setAuthorization(uri);

    const payload = await httpApi.put(
      `${this.baseUrl}${uri}`,
      body ? JSON.stringify(body) : null,
      { ...this.defaultHeaders, ...(headers || {}) },
      controller,
    );

    this.responseinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    return payload;
  }

  public async uploadImage<T>(
    uri: string,
    body?: FormData | Blob,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<T> {
    this.requestinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    await this.setAuthorization(uri);

    const tempHeaders = { ...this.defaultHeaders };

    delete tempHeaders['content-type'];

    const payload = await httpApi.put(
      `${this.baseUrl}${uri}`,
      body,
      { ...tempHeaders, ...(headers || {}) },
      controller,
    );

    this.responseinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    return payload;
  }

  public async uploadFile<T>(
    uri: string,
    body?: FormData | Blob,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<T> {
    this.requestinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    await this.setAuthorization(uri);

    const tempHeaders = { ...this.defaultHeaders };

    delete tempHeaders['content-type'];

    const payload = await httpApi.post(
      `${this.baseUrl}${uri}`,
      body,
      { ...tempHeaders, ...(headers || {}) },
      controller,
    );

    this.responseinterceptors.forEach((cb: RequestInterceptorCallback) => {
      cb();
    });

    return payload;
  }
}
