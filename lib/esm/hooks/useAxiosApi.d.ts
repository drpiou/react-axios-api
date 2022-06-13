import { AxiosOptions, AxiosApiRequest, AxiosResponseRequest } from '@drpiou/axios';
export declare type UseAxiosApiOptions<AO = unknown, BD = unknown, SD = any, ED = any, CD = any> = {
    onAfter?: UseAxiosApiCallbackAfter<AO, BD, SD, ED, CD>;
    onBefore?: UseAxiosApiCallbackBefore<AO, BD, SD, ED>;
};
export declare type UseAxiosApiRequestOptions<SD = any, ED = any> = AxiosOptions<SD, ED> & {
    autoAbort?: boolean;
};
export declare type UseAxiosApiCallbackAfter<AO = unknown, BD = unknown, SD = any, ED = any, CD = any> = (response: AxiosResponseRequest<SD, ED, CD>, before: BD | undefined, apiOptions?: AO, configOptions?: UseAxiosApiRequestOptions<SD, ED>) => void | Promise<void>;
export declare type UseAxiosApiCallbackBefore<AO = unknown, BD = unknown, SD = any, ED = any> = (apiOptions?: AO, configOptions?: UseAxiosApiRequestOptions<SD, ED>) => BD | Promise<BD>;
export declare type UseAxiosApiRequest<SD = any, ED = any, CD = any, AO = unknown> = CD extends undefined ? (data?: null, apiOptions?: AO, configOptions?: UseAxiosApiRequestOptions<SD, ED>) => Promise<AxiosResponseRequest<SD, ED, CD> | undefined> : (data: CD, apiOptions?: AO, configOptions?: UseAxiosApiRequestOptions<SD, ED>) => Promise<AxiosResponseRequest<SD, ED, CD> | undefined>;
export declare type UseAxiosApi<A, AO = unknown> = {
    [K in keyof A]: A[K] extends AxiosApiRequest<infer CD, infer SD, infer ED> ? UseAxiosApiRequest<SD, ED, CD, AO> : never;
};
export declare type UseAxiosApiList<A> = {
    [K in keyof A]: A[K] extends AxiosApiRequest<infer CD, infer SD, infer ED> ? AxiosApiRequest<SD, ED, CD> : never;
};
declare const useAxiosApi: <T, A extends UseAxiosApiList<T>, AO = unknown, BD = unknown>(api: A, options?: UseAxiosApiOptions<AO, BD, any, any, any> | undefined) => UseAxiosApi<A, AO>;
export default useAxiosApi;
