import { AxiosError, isAxiosError as isAxiosErrorOriginal } from 'axios';
import { ApiErrorResponse } from '@/types';

/**
 * カスタム型ガード: エラーがAxiosのエラーであり、かつレスポンスを持っているか判定する。
 * これがtrueの場合、error.response は undefined ではないことが保証される。
 */
export function isApiError(error: unknown): error is AxiosError<ApiErrorResponse> & { response: NonNullable<AxiosError<ApiErrorResponse>['response']> } {
    return isAxiosErrorOriginal(error) && error.response !== undefined;
}
