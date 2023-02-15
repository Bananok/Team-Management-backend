// Services
import { emitToAllUsers, emitToUser } from 'socket/services/redis';

// Handlers
import { handlerGenerator as handlerForceDisconnectGenerator } from 'socket/handlers/force-disconnect';
import { handlerGenerator as handlerProfileChangesGenerator } from 'socket/handlers/profile/changes';
import { handlerGenerator as handlerUserConnectGenerator } from 'socket/handlers/user/connect';
import { handlerGenerator as handlerUserDisconnectGenerator } from 'socket/handlers/user/disconnect';
import { handlerGenerator as handlerMessageTypingGenerator } from 'socket/handlers/user/typing';

// Models
import { IUser } from 'models/user.model';

export const forceDisconnectUserByDeviceId = async (userId: string, deviceId: string): Promise<void> => {
  await emitToUser(userId, handlerForceDisconnectGenerator(deviceId));
};

export const sendProfileChanges = async (userId: string, changes: Partial<IUser>): Promise<void> => {
  await emitToUser(userId, handlerProfileChangesGenerator(changes));
};

export const sendUserConnect = async (userId: string): Promise<void> => {
  await emitToAllUsers(handlerUserConnectGenerator(userId));
};

export const sendUserDisconnect = async (userId: string): Promise<void> => {
  await emitToAllUsers(handlerUserDisconnectGenerator(userId));
};

export const sendMessageTyping = async (userId: string, recipientId: string): Promise<void> => {
  await emitToUser(recipientId, handlerMessageTypingGenerator(userId));
};
