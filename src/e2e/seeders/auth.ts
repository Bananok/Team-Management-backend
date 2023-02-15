import { QueryInterface } from 'sequelize';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

// Types
import { UserRole } from 'interfaces/user';

// Generators
import { generateDevice, generateRefreshToken, generateUser } from 'e2e/seeders/generators';

const PASSWORD = '123456';
const ENCRYPT_PASSWORD_ROUNDS = 1;

const ADMIN_ID = uuid();
const ADMIN_EMAIL = 'admin1@gmail.com';

const SECOND_ADMIN_ID = uuid();
const SECOND_ADMIN_EMAIL = 'admin2@gmail.com';

const USER_ID = uuid();
const USER_DEVICE_ID = 'testing';
const USER_EMAIL = 'user1@gmail.com';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        generateUser({
          id: ADMIN_ID,
          role: UserRole.ADMIN,
          email: ADMIN_EMAIL,
          password: bcrypt.hashSync(PASSWORD, ENCRYPT_PASSWORD_ROUNDS),
        }),
        generateUser({
          id: SECOND_ADMIN_ID,
          role: UserRole.ADMIN,
          email: SECOND_ADMIN_EMAIL,
          password: bcrypt.hashSync(PASSWORD, ENCRYPT_PASSWORD_ROUNDS),
        }),
        generateUser({
          id: USER_ID,
          role: UserRole.USER,
          email: USER_EMAIL,
          password: bcrypt.hashSync(PASSWORD, ENCRYPT_PASSWORD_ROUNDS),
        }),
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'Devices',
      [
        generateDevice({
          userId: USER_ID,
          deviceId: USER_DEVICE_ID,
        }),
        generateDevice({
          userId: SECOND_ADMIN_ID,
          deviceId: 'deviceAdmin2Id',
        }),
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'RefreshTokens',
      [
        generateRefreshToken({
          token: 'testRefreshToken',
          deviceId: USER_DEVICE_ID,
          userId: USER_ID,
        }),
        generateRefreshToken({
          token: 'testAdminRefreshToken',
          deviceId: 'deviceAdmin2Id',
          userId: SECOND_ADMIN_ID,
        }),
      ],
      {}
    );
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('Users', {}, {});
  },
};
