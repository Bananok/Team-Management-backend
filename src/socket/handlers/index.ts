import Joi, { Schema } from 'joi';
import { SchemaObject } from 'openapi3-ts';
import { parseJoiSchema } from 'express-joi-openapi';

// Services
import logger from 'services/logger';

// Utils
import { wsSpecificationPaths } from 'utils/Validation';

// Types
import { Context } from 'socket/types/context';

import * as forceDisconnect from './force-disconnect';
import profile from './profile';
import user from './user';

const handlerMap: {
  [handlerName: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (ctx: Context, data?: any) => Promise<any>;
    responseSchema?: Schema;
    description?: string;
  };
} = {
  'force-disconnect': forceDisconnect,
  'profile.changes': profile.changes,
  'user.connect': user.connect,
  'user.disconnect': user.disconnect,
  'user.typing': user.typing,
};

Object.entries(handlerMap).forEach(([handlerName, handlerObj]) => {
  if (!handlerObj.responseSchema) {
    return;
  }

  wsSpecificationPaths.push({
    path: `${handlerName}`,
    pathItem: {
      get: {
        responses: {
          default: {
            content: {
              'application/json': {
                schema: parseJoiSchema(
                  Joi.object({
                    data: handlerObj.responseSchema.required().description('Data'),
                  })
                ).schema as SchemaObject,
              },
            },
            description: handlerName,
          },
        },
        tags: ['Websocket'],
        // tags: [`Websocket - ${capitalize(handlerName.split('.')[0])}`],
        description: handlerObj.description,
      },
    },
  });
});

export default (ctx: Context) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  (action: string, data: any): void => {
    if (!handlerMap[action]) {
      return;
    }

    logger.debug('SOCKET HANDLER REQUEST:', 'Action:', action, 'Body:', JSON.stringify(data));

    handlerMap[action]
      .handler(ctx, data)
      .then(() => {
        logger.debug('SOCKET HANDLER EMIT:', 'Action:', action, 'Body:', JSON.stringify(data));
      })
      .catch((error) => {
        logger.debug('SOCKET HANDLER ERROR:', 'Action:', action, 'Body:', `${JSON.stringify(data)},`, 'Error:', error);
      });
  };
