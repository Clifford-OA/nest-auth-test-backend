import { ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from 'src/dtos/response.dto';

export interface ApiErrorResponseOptions {
  status?: number;
  description?: string;
  message?: string;
  messages?: Record<string, string>;
}

export const ApiErrorresponse = (options?: ApiErrorResponseOptions) => {
  const status = options.status ?? 400;

  let examples: Record<string, { value: ResponseDto<any> }>;

  if (options?.messages) {
    examples = {};
    for (const key in options.messages) {
      examples[key] = {
        value: {
          success: false,
          error: { code: status, message: options.messages[key] },
        },
      };
    }
  }

  return ApiResponse({
    status,
    description: options.description ?? 'Bad Request',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'number', example: status },
                message: { type: 'string', example: options?.message },
              },
            },
          },
        },
        examples,
      },
    },
  } as any);
};
