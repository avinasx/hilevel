import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiHeader } from '@nestjs/swagger';

export function VersionParam(): MethodDecorator {
  return applyDecorators(
    ApiParam({
      name: 'version',
      description: 'API Version',
      enum: ['1.0'],
      schema: {
        default: '1.0',
      },
    }),
  );
}

export function HeaderParam(): MethodDecorator {
  return applyDecorators(
    ApiHeader({
      name: 'Accept-Language',
      required: true,
      description: 'Select Language',
      enum: ['en', 'hi'],
      schema: {
        default: 'en',
      },
    }),
  );
}
