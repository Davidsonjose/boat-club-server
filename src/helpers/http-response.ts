import { HttpException, HttpStatus } from '@nestjs/common';
import { enrichWithErrorDetail } from './axiosError';

export function responseOk<T>(data: {
  message?: string;
  data?: T;
  status?: HttpStatus;
}) {
  return {
    message: data.message ?? 'done',
    data: data.data ?? null,
    statusCode: data.status ?? HttpStatus.OK,
  };
}

export function responseError<T>(data: {
  message?: string;
  data?: T;
  status?: HttpStatus;
  cause?: Error;
}) {
  return new HttpException(
    {
      message:
        data.message ??
        'An error occured while processing this request. Please try again',
      data: data.data ?? null,
    },
    data.status ?? HttpStatus.BAD_REQUEST,
    !data.cause
      ? undefined
      : {
          cause: data.cause,
        },
  );
}

export function safeResponse(err: Error) {
  const errStr = enrichWithErrorDetail(err).error;
  const errStrLower = errStr.toLowerCase();

  if (
    errStrLower.includes('prisma') ||
    errStrLower.includes('axios') ||
    errStrLower.includes('{')
  ) {
    return 'Something went wrong on our end. If this error persists, please reach out to support';
  }
  if (errStrLower.includes('source balance err')) {
    return 'Sorry, you need to top up your base asset balance for this transaction to go through';
  }
  return errStr;
}
