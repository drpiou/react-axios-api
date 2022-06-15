# `@drpiou/react-axios`

![GitHub](https://img.shields.io/github/license/drpiou/react-axios-api)
![GitHub package.json version](https://img.shields.io/github/package-json/v/drpiou/react-axios-api)
![Jest tests](https://img.shields.io/badge/stage-experimental-important)
![GitHub all releases](https://img.shields.io/github/downloads/drpiou/react-axios-api/total)

The `@drpiou/react-axios-api` package provides a React api context around the `@drpiou/axios` package.

> - wraps `@drpiou/axios` requests in a hook
> - automatic abort: abort the request when the component unmounts.
> - written in TypeScript.

<!--ts-->

- [Compatibility](#compatibility)
- [Installation](#installation)
- [Example](#example)
- [Documentation](#documentation)

<!--te-->

## Compatibility

- React (17.0.2+)
- React Native (0.64.0+)
- Expo (43+)

## Installation

```shell
yarn add @drpiou/react-axios-api
```

### Peer Dependencies

```shell
yarn add @drpiou/axios@^0.0.1
```

## Usage

### `useAxiosApi`

The `useAxiosApi` React hook is expected to be wrapped around your own React hook. It accepts an object of api requests made with `@drpiou/axios` and an optional options object to interact with the request/response.

Minimal usage:

```typescript jsx
import { api, ApiList } from '@/src/api'; // See "Examples"
import { UseAxiosApi, useAxiosApi } from '@drpiou/react-axios-api';

export const useApi = (): UseAxiosApi<ApiList> => {
  return useAxiosApi(api);
};
```

## Example

### `hooks/useApi.ts`

```typescript jsx
import { api, ApiList } from '@/src/api';
import {
  UseAxiosApi,
  useAxiosApi,
  UseAxiosApiCallbackAfter,
} from '@drpiou/react-axios-api';

export type UseApiOptions = {
  showNotification?: boolean;
};

export type UseApiCallbackAfter = UseAxiosApiCallbackAfter<UseApiOptions>;

export const useApi = (): UseAxiosApi<ApiList, UseApiOptions> => {
  const notification = useNotification();

  const callbackAfter: UseApiCallbackAfter = useCallback(
    (response, before, apiOptions) => {
      if (apiOptions?.showNotification) {
        notification.show(response.isError ? 'error' : 'success');
      }
    },
    [notification],
  );

  const options = useMemo(
    () => ({
      onAfter: callbackAfter,
    }),
    [callbackBefore],
  );

  return useAxiosApi(api, options);
};
```

### `api/index.ts`

```typescript jsx
import { getTranslation } from '@/api/getTranslation';

export type ApiList = typeof api;

export type ApiKey = keyof ApiList;

export const api = {
  getTranslation,
};
```

### `api/getTranslation.ts`

```typescript jsx
import { requestApi } from '@/api/requestApi';
import { AxiosApiRequest } from '@drpiou/axios';

export type ApiTranslationData = {
  lang_code: string;
};

export type ApiTranslationResponseData = Record<string, unknown>;

export const getTranslation: AxiosApiRequest<
  ApiTranslationData,
  ApiTranslationResponseData
> = (data, options) => {
  return requestApi({
    url: 'translation',
    method: 'GET',
    params: data,
  });
};
```

### `components/MyComponent/index.tsx`

```typescript jsx
import { useApi } from '../../hooks/useApi';

const MyComponent = (): JSX.Element => {
  const api = useApi();

  const handlePress = (): void => {
    void api.getTranslation(
      { lang_code: 'fr' },
      { showNotification: true },
      { autoAbort: true },
    );
  };

  return <div onClick={handlePress} />;
};

export default MyComponent;
```

## Documentation

```typescript
type useAxiosApi = <
  T,
  A extends UseAxiosApiList<T>,
  AO = unknown,
  BD = unknown,
>(
  api: A,
  options?: UseAxiosApiOptions<AO, BD>,
) => UseAxiosApi<A, AO>;

type UseAxiosApiOptions<
  AO = unknown,
  BD = unknown,
  SD = any,
  ED = any,
  CD = any,
> = {
  onAfter?: UseAxiosApiCallbackAfter<AO, BD, SD, ED, CD>;
  onBefore?: UseAxiosApiCallbackBefore<AO, BD, SD, ED>;
};

type UseAxiosApiRequestOptions<SD = any, ED = any> = AxiosOptions<SD, ED> & {
  autoAbort?: boolean; // Default: false
};

type UseAxiosApiCallbackAfter<
  AO = unknown,
  BD = unknown,
  SD = any,
  ED = any,
  CD = any,
> = (
  response: AxiosResponseRequest<SD, ED, CD>,
  before: BD | undefined,
  apiOptions?: AO,
  configOptions?: UseAxiosApiRequestOptions<SD, ED>,
) => void | Promise<void>;

type UseAxiosApiCallbackBefore<
  AO = unknown,
  BD = unknown,
  SD = any,
  ED = any,
> = (
  apiOptions?: AO,
  configOptions?: UseAxiosApiRequestOptions<SD, ED>,
) => BD | Promise<BD>;

type UseAxiosApiRequest<
  SD = any,
  ED = any,
  CD = any,
  AO = unknown,
> = CD extends undefined
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

type UseAxiosApi<A, AO = unknown> = {
  [K in keyof A]: A[K] extends AxiosApiRequest<infer CD, infer SD, infer ED>
    ? UseAxiosApiRequest<SD, ED, CD, AO>
    : never;
};

type UseAxiosApiList<A> = {
  [K in keyof A]: A[K] extends AxiosApiRequest<infer CD, infer SD, infer ED>
    ? AxiosApiRequest<SD, ED, CD>
    : never;
};
```
