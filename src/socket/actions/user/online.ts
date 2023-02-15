import Joi from 'joi';

// Services
import { getOnlineUsers } from 'socket/services/redis';

// Types
import { Context } from 'socket/types/context';

export const description = 'Get online user ids';

export const responseSchema = Joi.array()
  .items(Joi.string().uuid({ version: 'uuidv4' }))
  .required();

export const action = async ({ user }: Context): Promise<string[]> => {
  const onlineUsersIds = await getOnlineUsers();

  const currentUserIndex = onlineUsersIds.indexOf(user.id);

  if (currentUserIndex > -1) {
    onlineUsersIds.splice(currentUserIndex, 1);
  }

  return onlineUsersIds;
};
