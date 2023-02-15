import IORedis from 'ioredis';
import { v4 as uuid } from 'uuid';

// Configs
import configVars from 'config/vars';

// Types
import { RedisHandler } from 'socket/types/redis';

const connectionName = `heramed.${uuid()}`;

const redis = new IORedis(configVars.REDIS_URL, {
  connectionName,
});
const sub = new IORedis(configVars.REDIS_URL);
const pub = new IORedis(configVars.REDIS_URL);

export const ping = (): Promise<string> => {
  return redis.ping();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userSubscriptionMap: { [userId: string]: ((action: string, data: any) => void)[] } = {};

export const subscribeToAllUsers = async (): Promise<void> => {
  await sub.subscribe('users');
};

export const subscribeToUser = async (
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (action: string, data: any) => void
): Promise<void> => {
  if (!userSubscriptionMap[userId]) {
    userSubscriptionMap[userId] = [];

    await sub.subscribe(`user:${userId}`);
  }

  userSubscriptionMap[userId].push(action);
};

export const unsubscribeFromUser = async (
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (action: string, data: any) => void
): Promise<void> => {
  const actionIndex = userSubscriptionMap[userId].indexOf(action);

  if (actionIndex > -1) {
    userSubscriptionMap[userId].splice(actionIndex, 1);
  }

  if (!userSubscriptionMap[userId].length) {
    delete userSubscriptionMap[userId];

    await sub.unsubscribe(`user:${userId}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emitToUser = (userId: string, data: RedisHandler<any>): Promise<number> => {
  return pub.publish(`user:${userId}`, JSON.stringify(data));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emitToAllUsers = (data: RedisHandler<any>): Promise<number> => {
  return pub.publish('users', JSON.stringify(data));
};

export const dispose = (): void => {
  redis.disconnect();
  pub.disconnect();
  sub.disconnect();
};

sub.on('message', (channel: string, message: string) => {
  const [type, id] = channel.split(':');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { action, data }: RedisHandler<any> = JSON.parse(message);

  switch (type) {
    case 'user':
      userSubscriptionMap[id].forEach((subscription) => {
        subscription(action, data);
      });

      break;
    case 'users':
      Object.values(userSubscriptionMap).forEach((userSubscriptions) => {
        userSubscriptions.forEach((subscription) => {
          subscription(action, data);
        });
      });

      break;
    default:
      break;
  }
});

export const getRedisClientNameList = async (): Promise<string[]> => {
  const clients: { name?: string }[] = await redis.client('list');

  const clientNames: string[] = [];

  clients.forEach((client): void => {
    if (typeof client.name === 'string' && client.name.length) {
      clientNames.push(client.name);
    }
  });

  return clientNames;
};

export const getOnlineUsers = async (filteringClients?: string[]): Promise<string[]> => {
  const onlineList = await redis.keys('online:*');
  const onlineObjList = onlineList.map((onlineString) => {
    const [, clientName, socketId, userId] = onlineString.split(':');

    return {
      clientName,
      socketId,
      userId,
    };
  });

  const filteredOnlineObjList = filteringClients
    ? onlineObjList.filter((item) => !filteringClients.includes(item.clientName))
    : onlineObjList;

  return [...new Set(filteredOnlineObjList.map((item) => item.userId))];
};

export const getOnlineUsersToDisconnect = async (): Promise<string[]> => {
  const activeRedisClients = await getRedisClientNameList();
  const onlineList = await redis.keys('online:*');
  const onlineObjList = onlineList.map((onlineString) => {
    const [, clientName, socketId, userId] = onlineString.split(':');

    return {
      clientName,
      socketId,
      userId,
    };
  });

  const filteredDisconnectedItems = onlineObjList.filter((item) => !activeRedisClients.includes(item.clientName));

  const activeOnlineUsers: string[] = [
    ...new Set(onlineObjList.filter((item) => activeRedisClients.includes(item.clientName)).map((item) => item.userId)),
  ];
  const disconnectedOnlineUsers: string[] = [...new Set(filteredDisconnectedItems.map((item) => item.userId))];

  await Promise.all(
    filteredDisconnectedItems.map(({ clientName, socketId, userId }) =>
      redis.del(`online:${clientName}:${socketId}:${userId}`)
    )
  );

  return disconnectedOnlineUsers.filter((userId) => !activeOnlineUsers.includes(userId));
};

export const isUserOnline = async (userId: string): Promise<boolean> => {
  const onlineUsers = await getOnlineUsers();

  return onlineUsers.includes(userId);
};

export const setUserStatus = async (socketId: string, userId: string, isOnline: boolean): Promise<void> => {
  const key = `online:${connectionName}:${socketId}:${userId}`;

  if (isOnline) {
    await redis.set(key, Date.now());
  } else {
    await redis.del(key);
  }
};
