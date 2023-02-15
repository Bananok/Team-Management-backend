// Types
import { RedisHandler } from 'socket/types/redis';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userSubscriptionMap: { [userId: string]: ((action: string, data: any) => void)[] } = {};

export const subscribeToUser = async (
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (action: string, data: any) => void
): Promise<void> => {
  if (!userSubscriptionMap[userId]) {
    userSubscriptionMap[userId] = [];
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
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emitToUser = async (userId: string, data: RedisHandler<any>): Promise<number> => {
  userSubscriptionMap[userId]?.forEach((subscription) => {
    subscription(data.action, data.data);
  });

  return 1;
};
