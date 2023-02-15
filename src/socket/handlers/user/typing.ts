// Types
import { generateActionName } from 'socket/helpers/action';
import { Context } from 'socket/types/context';
import { RedisHandler } from 'socket/types/redis';

export const handlerGenerator = (userId: string): RedisHandler<string> => ({
  action: generateActionName(__filename),
  data: userId,
});

export const handler = async ({ socket }: Context, userId: string): Promise<void> => {
  socket.emit('user.typing', { data: userId });
};
