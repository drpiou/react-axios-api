import { AxiosOptions, AxiosApiRequest, AxiosRequestAbort, AxiosResponseRequest } from '@drpiou/axios';
import { useIsMounted, useOnUnmount } from '@drpiou/react-utils';
import { withoutProperties } from '@drpiou/ts-utils';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import uniqueId from 'lodash/uniqueId';
import { useMemo, useRef } from 'react';

export type UseAxiosApiOptions<AO = unknown, BD = unknown, SD = any, ED = any, CD = any> = {
  onAfter?: UseAxiosApiCallbackAfter<AO, BD, SD, ED, CD>;
  onBefore?: UseAxiosApiCallbackBefore<AO, BD, SD, ED>;
};

export type UseAxiosApiRequestOptions<SD = any, ED = any> = AxiosOptions<SD, ED> & {
  autoAbort?: boolean;
};

export type UseAxiosApiCallbackAfter<AO = unknown, BD = unknown, SD = any, ED = any, CD = any> = (
  response: AxiosResponseRequest<SD, ED, CD>,
  before: BD | undefined,
  apiOptions?: AO,
  configOptions?: UseAxiosApiRequestOptions<SD, ED>,
) => void | Promise<void>;

export type UseAxiosApiCallbackBefore<AO = unknown, BD = unknown, SD = any, ED = any> = (
  apiOptions?: AO,
  configOptions?: UseAxiosApiRequestOptions<SD, ED>,
) => BD | Promise<BD>;

export type UseAxiosApiRequest<SD = any, ED = any, CD = any, AO = unknown> = CD extends undefined
  ? (
      data?: null,
      apiOptions?: AO,
      configOptions?: UseAxiosApiRequestOptions<SD, ED>,
    ) => Promise<AxiosResponseRequest<SD, ED, CD> | undefined>
  : (
      data: CD,
      apiOptions?: AO,
      configOptions?: UseAxiosApiRequestOptions<SD, ED>,
    ) => Promise<AxiosResponseRequest<SD, ED, CD> | undefined>;

export type UseAxiosApi<A, AO = unknown> = {
  [K in keyof A]: A[K] extends AxiosApiRequest<infer CD, infer SD, infer ED> ? UseAxiosApiRequest<SD, ED, CD, AO> : never;
};

export type UseAxiosApiList<A> = {
  [K in keyof A]: A[K] extends AxiosApiRequest<infer CD, infer SD, infer ED> ? AxiosApiRequest<SD, ED, CD> : never;
};

const DEFAULT_OPTIONS: UseAxiosApiRequestOptions = {
  autoAbort: false,
};

const defaultOptionsKeys = Object.keys(DEFAULT_OPTIONS);

const useAxiosApi = <T, A extends UseAxiosApiList<T>, AO = unknown, BD = unknown>(
  api: A,
  options?: UseAxiosApiOptions<AO, BD>,
): UseAxiosApi<A, AO> => {
  const controllers = useRef<{ [key: string]: AxiosRequestAbort }>({});

  const isMounted = useIsMounted();

  const requests = useMemo(
    () =>
      mapValues(api, (apiRequest: AxiosApiRequest) => {
        return async <CD = any, SD = any, ED = any>(
          data?: CD | null,
          apiOptions?: AO,
          configOptions?: UseAxiosApiRequestOptions<SD, ED>,
        ): Promise<AxiosResponseRequest<SD, ED, CD> | undefined> => {
          const apiId = uniqueId('api:');

          const requestOptions = { ...DEFAULT_OPTIONS, ...configOptions } as UseAxiosApiRequestOptions<SD, ED>;

          const request = (apiRequest as AxiosApiRequest<CD, SD, ED>)(
            data as never,
            withoutProperties(requestOptions, defaultOptionsKeys),
          );

          let before: BD | undefined = undefined;

          if (typeof options?.onBefore === 'function') {
            before = await options?.onBefore(apiOptions, requestOptions);
          }

          if (requestOptions.autoAbort) {
            controllers.current[apiId] = request.abort;
          }

          const response = await request.start({
            abort: requestOptions.autoAbort && !isMounted.current,
          });

          delete controllers.current[apiId];

          if (typeof options?.onAfter === 'function') {
            await options?.onAfter(response, before, apiOptions, requestOptions);
          }

          return response as AxiosResponseRequest<SD, ED, CD>;
        };
      }),
    [api, isMounted, options],
  );

  useOnUnmount(() => {
    map(controllers.current, (abort) => {
      abort();
    });
  });

  return requests as UseAxiosApi<A, AO>;
};

export default useAxiosApi;
