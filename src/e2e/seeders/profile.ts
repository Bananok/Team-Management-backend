import { QueryInterface } from 'sequelize';
import { v4 as uuid } from 'uuid';

// Generators
import { generateUser, generateDevice } from 'e2e/seeders/generators';

const MAIN_USER_ID = uuid();
const MAIN_USER_DEVICE_ID = 'test';
// const MAIN_USER_PHONE_NUMBER = 79136532506;

const CUSTOM_USER_ID = uuid();
const CUSTOM_USER_DEVICE_ID = 'test2';
// const CUSTOM_USER_PHONE_NUMBER = 79136532507;

const FRIEND_USER_ID = uuid();
const FRIEND_USER_DEVICE_ID = 'friendTest';
// const FRIEND_USER_PHONE_NUMBER = 19136532508;

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        generateUser({
          id: MAIN_USER_ID,
        }),
        generateUser({
          id: CUSTOM_USER_ID,
        }),
        generateUser({
          id: FRIEND_USER_ID,
        }),
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'Devices',
      [
        generateDevice({
          userId: MAIN_USER_ID,
          deviceId: MAIN_USER_DEVICE_ID,
        }),
        generateDevice({
          userId: CUSTOM_USER_ID,
          deviceId: CUSTOM_USER_DEVICE_ID,
        }),
        generateDevice({
          userId: FRIEND_USER_ID,
          deviceId: FRIEND_USER_DEVICE_ID,
        }),
      ],
      {}
    );
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('Users', {}, {});
  },
};
