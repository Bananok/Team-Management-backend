import faker from 'faker';
import jwt from 'jwt-simple';
import moment from 'moment-timezone';

// Models
import { Device } from 'models/device.model';

export default ({
  createdAt = new Date(),
  updatedAt = new Date(),
  deviceId = faker.datatype.uuid(),
  accessToken,
  accessTokenExpires = moment().add(1, 'day').toDate(),
  userId,
}: {
  createdAt?: Date;
  updatedAt?: Date;
  deviceId?: string;
  accessToken?: string;
  accessTokenExpires?: Date;
  userId: string;
}): Partial<Device> => ({
  createdAt,
  updatedAt,
  deviceId,
  accessToken:
    accessToken ||
    jwt.encode(
      {
        userId,
        deviceId,
        expires: accessTokenExpires,
      },
      process.env.JWT_SECRET || 'secret'
    ),
  accessTokenExpires,
  userId,
});
