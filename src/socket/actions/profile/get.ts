// Types
import { Context } from 'socket/types/context';

// Models
import { IUser, IUserTransformType, User } from 'models/user.model';

// Schema
import { UserSchema } from 'utils/Validation/schemas/user';

export const description = 'Get profile';

export const responseSchema = UserSchema.required();

export const action = async ({ user }: Context): Promise<IUser> => {
  const actualUser = await User.findUserByPk(user.id);

  return actualUser!.transform(IUserTransformType.private);
};
