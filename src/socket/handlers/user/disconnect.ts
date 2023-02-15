import Joi from 'joi';

// Types
import { Context } from 'socket/types/context';
import { RedisHandler } from 'socket/types/redis';

// Helpers
import { generateActionName } from 'socket/helpers/action';

export const description = 'User disconnected';

export const responseSchema = Joi.string().uuid({ version: 'uuidv4' }).required().description('User id');

export const handlerGenerator = (userId: string): RedisHandler<string> => ({
  action: generateActionName(__filename),
  data: userId,
});

export const handler = async ({ socket }: Context, userId: string): Promise<void> => {
  socket.emit('user.disconnect', { data: userId });
};
