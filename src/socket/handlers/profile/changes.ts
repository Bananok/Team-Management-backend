// Helpers
import { generateActionName } from 'socket/helpers/action';

// Types
import { Context } from 'socket/types/context';
import { RedisHandler } from 'socket/types/redis';

// Schemas
import { UserSchema } from 'utils/Validation/schemas/user';

// Models
import { IUser } from 'models/user.model';

export const description = 'Profile changes was updated';

export const responseSchema = UserSchema.description('Partial of changes data');

export const handlerGenerator = (data: Partial<IUser>): RedisHandler<Partial<IUser>> => ({
  action: generateActionName(__filename),
  data,
});

export const handler = async ({ socket }: Context, data: Partial<IUser>): Promise<void> => {
  socket.emit(generateActionName(__filename), {
    data,
  });
};
