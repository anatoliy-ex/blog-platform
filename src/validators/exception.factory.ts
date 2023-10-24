import { BadRequestException } from '@nestjs/common';
import { exceptionObjectType } from '../types/user.confirm.types';

export const customExceptionFactory = (errors) => {
  const errorsForResponse: exceptionObjectType[] = [];

  errors.forEach((e) => {
    const constraintKeys = Object.keys(e.constraints);

    constraintKeys.forEach((ckey) => {
      errorsForResponse.push({
        message: e.constraints[ckey],
        field: e.property,
      });
    });
  });

  throw new BadRequestException(errorsForResponse);
};
