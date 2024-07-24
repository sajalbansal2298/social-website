/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
const SUCCESS_MIN = 200;
const SUCCESS_MAX = 299;

export type RequestBody = Blob | FormData | URLSearchParams | ReadableStream<Uint8Array> | string;

export async function request(
  method: string,
  url: string,
  body?: RequestBody | null,
  headers?: Record<string, string>,
  controller?: AbortController,
): Promise<any> {
  if (!method || !url) {
    throw new Error('Missing required parameters method/url');
  }

  const res = await fetch(url, {
    mode: 'cors',
    credentials: 'same-origin',
    redirect: 'follow',
    method,
    body,
    headers,
    signal: controller ? controller.signal : null,
  });

  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }

  if (res.status < SUCCESS_MIN || res.status > SUCCESS_MAX) {
    throw new Error(JSON.stringify({ status: res.status, data }));
  }

  return data;
}
