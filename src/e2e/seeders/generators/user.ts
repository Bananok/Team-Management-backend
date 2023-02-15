import faker from 'faker';

// Types
import { UserRole } from 'interfaces/user';

// Models
import { User } from 'models/user.model';

export default ({
  id = faker.datatype.uuid(),
  createdAt = new Date(),
  updatedAt = new Date(),
  name = User.name,
  email = faker.internet.email(),
  password = faker.internet.password(),
  role = UserRole.USER,
}: {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}): Partial<User> => ({
  id,
  createdAt,
  updatedAt,
  name,
  email,
  password,
  role,
});
