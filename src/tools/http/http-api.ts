/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
import { request } from './fetch.worker';
import type { RequestBody } from './fetch.worker';
import classInstanceProvider from '../classInstanceProvider';

export class HttpApi {
  public async delete(url: string, headers?: Record<string, string>, controller?: AbortController): Promise<any> {
    return request('DELETE', url, undefined, headers, controller);
  }

  public async get(url: string, headers?: Record<string, string>, controller?: AbortController): Promise<any> {
    return request('GET', url, undefined, headers, controller);
  }

  public async patch(
    url: string,
    body?: RequestBody | null,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<any> {
    return request('PATCH', url, body, headers, controller);
  }

  public async post(
    url: string,
    body?: RequestBody | null,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<any> {
    return request('POST', url, body, headers, controller);
  }

  public async put(
    url: string,
    body?: RequestBody | null,
    headers?: Record<string, string>,
    controller?: AbortController,
  ): Promise<any> {
    return request('PUT', url, body, headers, controller);
  }
}

export const httpApi = classInstanceProvider.getInstance(HttpApi);
