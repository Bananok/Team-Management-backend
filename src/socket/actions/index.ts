import Joi, { Schema } from 'joi';
import { SchemaObject } from 'openapi3-ts';
import { parseJoiSchema } from 'express-joi-openapi';

// Helpers
import { errorHandler } from 'socket/helpers/error';

// Services
import logger from 'services/logger';

// Utils
import { wsSpecificationPaths } from 'utils/Validation';

// Configs
import configVars from 'config/vars';

// Types
import { Context } from 'socket/types/context';

// Action groups
import profile from './profile';
import user from './user';

const actionMap: {
  [actionName: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (ctx: Context, data?: any) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    validation?: Schema;
    responseSchema?: Schema;
    description?: string;
  };
} = {
  'profile.get': profile.get,
  'user.list': user.list,
  'user.online': user.online,
};

Object.entries(actionMap).forEach(([actionName, actionObj]) => {
  wsSpecificationPaths.push({
    path: `${actionName}`,
    pathItem: {
      post: {
        ...(actionObj.validation
          ? {
              requestBody: {
                content: {
                  'application/json': {
                    schema: parseJoiSchema(
                      Joi.object({
                        lid: Joi.string().optional().description('Temporary frontend id to link request and response'),
                        data: actionObj.validation.required().description('Sending data'),
                      })
                    ).schema as SchemaObject,
                  },
                },
              },
            }
          : null),
        responses: {
          ...(actionObj.responseSchema
            ? {
                default: {
                  content: {
                    'application/json': {
                      schema: parseJoiSchema(
                        Joi.object({
                          lid: Joi.string()
                            .optional()
                            .description('Temporary frontend id to link request and response'),
                          data: actionObj.responseSchema.required().description('Response data'),
                        })
                      ).schema as SchemaObject,
                    },
                  },
                  description: actionName,
                },
              }
            : null),
        },
        tags: ['Websocket'],
        // tags: [`Websocket - ${capitalize(actionName.split('.')[0])}`],
        description: actionObj.description,
      },
    },
  });
});

export default (ctx: Context): void => {
  Object.entries(actionMap).forEach(([actionName, actionObj]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx.socket.on(actionName, async (request: { lid?: string; data: any }) => {
      try {
        logger.debug('SOCKET ACTION REQUEST:', 'Action:', actionName, 'Body:', JSON.stringify(request));

        const validation = await actionObj.validation?.validateAsync(request.data);

        const response: {
          lid?: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: any;
        } = {
          data: await actionObj.action(ctx, validation?.value || request.data),
        };

        if (request.lid) {
          response.lid = request.lid;
        }

        if (configVars.env === 'test' || (typeof response.data !== 'undefined' && response.data !== null)) {
          ctx.socket.emit(actionName, response);

          logger.debug('SOCKET ACTION RESPONSE:', 'Action:', actionName, 'Body:', JSON.stringify(response));
        }
      } catch (error) {
        logger.warn('SOCKET ACTION ERROR:', 'Action:', actionName, 'Error:', error);

        const handledError = errorHandler(error);

        const response = {
          lid: request.lid,
          error: {
            code: handledError.code,
            message: handledError.message || handledError.status,
            fieldErrors: handledError.fieldErrors,
            stack: handledError.stack,
          },
        };

        if (configVars.env !== 'development') {
          delete response.error.stack;
        }

        ctx.socket.emit(actionName, response);
      }
    });
  });
};
