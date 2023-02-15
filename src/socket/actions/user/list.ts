import Joi from 'joi';
import { Op, WhereOptions } from 'sequelize';

// Types
import { Context } from 'socket/types/context';

// Models
import { IUser, User } from 'models/user.model';

// Schemas
import { UserSchema } from 'utils/Validation/schemas/user';

export const description = 'Get user list';

export const validation = Joi.object({
  q: Joi.string().allow(null).description('Search string'),
});

export const responseSchema = Joi.array().items(UserSchema).required();

export const action = async ({ user }: Context, { q = null }: { q?: string | null }): Promise<IUser[]> => {
  const whereAnd: WhereOptions[] = [
    {
      id: {
        [Op.ne]: user.id,
      },
    },
  ];

  if (typeof q === 'string' && q.length) {
    const qSplit = q.split(' ').filter((value) => !!value.length);

    whereAnd.push({
      [Op.or]: [
        ...qSplit.map((value) => ({
          firstname: {
            [Op.iLike]: `%${value}%`,
          },
        })),
        ...qSplit.map((value) => ({
          lastname: {
            [Op.iLike]: `%${value}%`,
          },
        })),
      ],
    });
  }

  const users = await User.findAll({
    where: {
      [Op.and]: whereAnd,
    },
  });

  return users.map((cUser) => cUser.transform());
};
