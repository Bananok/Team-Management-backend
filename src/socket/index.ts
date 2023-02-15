import { Server as HttpServer } from 'http';
import { NextFunction, Request, Response } from 'express';
import { Server as SocketServer, Socket as ServerSocket } from 'socket.io';
import moment from 'moment-timezone';

// Middlewares
import { authorize } from 'api/middlewares/auth';

// Services
import {
  setUserStatus,
  isUserOnline,
  subscribeToAllUsers,
  subscribeToUser,
  unsubscribeFromUser,
} from 'socket/services/redis';
import { sendUserConnect, sendUserDisconnect } from 'socket/services/redis-actions';

// Models
import { Device } from 'models/device.model';
import { User } from 'models/user.model';

// Types
import { Context } from './types/context';

import connectActions from './actions';
import connectHandlers from './handlers';

interface ExtendedError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

const customNext =
  (socket: ServerSocket, next: (err?: ExtendedError) => void) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any): void => {
    if (error) {
      socket.disconnect(true);

      return;
    }

    next();
  };

const initDisconnectTimeout = (ctx: Context): NodeJS.Timeout => {
  return setTimeout(async () => {
    const foundDevice = await Device.findUserDeviceByAccessToken(ctx.device.accessToken);

    if (!foundDevice || moment(foundDevice.accessTokenExpires).isBefore()) {
      ctx.socket.disconnect(true);
    } else {
      if (ctx.disconnectTimer) {
        clearTimeout(ctx.disconnectTimer);
      }

      ctx.disconnectTimer = initDisconnectTimeout(ctx);
    }
  }, -moment().diff(ctx.device.accessTokenExpires, 'milliseconds'));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initUserUpdateStatusTimer = (socketId: string, userId: string): any => {
  setUserStatus(socketId, userId, true);

  return setInterval(() => {
    setUserStatus(socketId, userId, true);
  }, 60000);
};

export default (server: HttpServer): SocketServer => {
  const socketServer = new SocketServer(server, {
    allowEIO3: true,
  });

  subscribeToAllUsers();

  socketServer
    .use((socket, next) => {
      // eslint-disable-next-line no-param-reassign
      socket.request.headers.authorization = socket.handshake.query.token as string;

      authorize()(socket.request as Request, {} as Response, customNext(socket, next) as NextFunction);
    })
    .on('connection', async (socket) => {
      const { user, device } = socket.request.context as {
        user: User;
        device: Device;
      };

      const ctx: Context = {
        user,
        device,
        socket,
        disconnectTimer: null,
      };

      ctx.disconnectTimer = initDisconnectTimeout(ctx);

      connectActions(ctx);

      const handler = connectHandlers(ctx);

      await subscribeToUser(user.id, handler);
      const updateStatusTimer = initUserUpdateStatusTimer(socket.id, user.id);

      await sendUserConnect(user.id);

      socket.on('disconnect', async () => {
        if (ctx.disconnectTimer) {
          clearTimeout(ctx.disconnectTimer);
        }

        socket.removeAllListeners();

        await setUserStatus(socket.id, user.id, false);

        if (!(await isUserOnline(user.id))) {
          await sendUserDisconnect(user.id);
        }

        if (updateStatusTimer) {
          clearInterval(updateStatusTimer);
        }

        await unsubscribeFromUser(user.id, handler);
      });
    });

  return socketServer;
};
