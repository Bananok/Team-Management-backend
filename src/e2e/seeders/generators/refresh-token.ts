// Models
import { RefreshToken } from 'models/refresh-token.model';

export default ({
  createdAt = new Date(),
  updatedAt = new Date(),
  token,
  deviceId,
  userId,
  expires = new Date(2030, 1, 1),
}: {
  createdAt?: Date;
  updatedAt?: Date;
  token: string;
  deviceId: string;
  userId: string;
  expires?: Date;
}): Partial<RefreshToken> => ({
  createdAt,
  updatedAt,
  token,
  deviceId,
  userId,
  expires,
});
