import { SetMetadata, applyDecorators } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './public-api-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorresponse } from './api-response.decorator';

export const ProtectedApi = () =>
  applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, false),
    ApiBearerAuth(),
    ApiErrorresponse({
      status: 401,
      description: 'Unauthorized',
      message: 'Unauthorized',
    }),
  );
