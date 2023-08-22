export class ResponseDto<T> {
  success: boolean;
  result?: T;
  error: ErrorDto | null;
}

export class ErrorDto {
  code: number;
  message: string;
}
