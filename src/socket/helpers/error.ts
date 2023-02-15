import { ValidationError } from 'joi';

// Utils
import APIError, { ErrorCode } from 'utils/APIError';

export const errorHandler = (error: ValidationError | APIError | Error): APIError => {
  let convertedError = error;

  if (error instanceof ValidationError) {
    convertedError = new APIError(ErrorCode.VALIDATION_ERROR, {
      fieldErrors: {
        body: error.details,
      },
    });
  } else if (!(error instanceof APIError)) {
    convertedError = new APIError(ErrorCode.INTERNAL_SERVER_ERROR, {
      message: error.message,
      stack: error.stack,
    });
  }

  return convertedError as APIError;
};
