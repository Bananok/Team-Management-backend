// Types
import { Context } from 'socket/types/context';
import { RedisHandler } from 'socket/types/redis';

export const handlerGenerator = (deviceId: string): RedisHandler<string> => ({
  action: 'force-disconnect',
  data: deviceId,
});

export const handler = async ({ device, socket }: Context, deviceId: string): Promise<void> => {
  if (deviceId === device.deviceId) {
    socket.disconnect(true);
  }
};
