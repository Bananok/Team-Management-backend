import { execSync } from 'child_process';
import http, { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { io, Socket as ClientSocket } from 'socket.io-client';
import { Sequelize } from 'sequelize';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import { RequestSegment } from 'express-joi-openapi';
import { ValidationErrorItem } from 'joi';

// Modules
import socketSetup from 'socket';

// Configs
import configVars from 'config/vars';
import initExpress from 'config/express';
import initSequelize from 'config/sequelize';

jest.mock('services/dynamic-links');
jest.mock('services/fcm');
jest.mock('services/google-search');
jest.mock('services/logger');
jest.mock('services/tiles');
jest.mock('socket/services/redis');
jest.mock('tasks/sendMessage.ts');

interface SocketResponse {
  lid?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: {
    code: string;
    message: string | number;
    fieldErrors?: { [segment in RequestSegment]?: ValidationErrorItem[] };
    stack?: string;
  };
}

interface SocketTestResponse {
  body: SocketResponse;
  socket: {
    connected: boolean;
    disconnected: boolean;
  };
}

interface SocketTestContext {
  httpServer: HttpServer;
  socketServer: SocketServer;
  sequelize: Sequelize;
  apiRequest: supertest.SuperTest<supertest.Test>;
  socketRequest: (
    token: string | undefined,
    actionName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ) => Promise<SocketTestResponse>;
  subscribe: (
    token: string | undefined,
    actionName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb?: (request: (actionName: string, data: any) => Promise<SocketTestResponse>) => void
  ) => Promise<SocketTestResponse>;
}

const makeRequest = (
  clientSocket: ClientSocket,
  actionName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  disconnectAfterResolving: boolean = true
): Promise<SocketTestResponse> => {
  return new Promise((resolve) => {
    const lid = uuid();

    clientSocket.on(actionName, (response: SocketResponse) => {
      if (response && response.lid && response.lid === lid) {
        resolve({
          body: response,
          socket: {
            connected: clientSocket.connected,
            disconnected: clientSocket.disconnected,
          },
        });

        if (disconnectAfterResolving) {
          clientSocket.off('disconnect');
          clientSocket.close();
        }
      }
    });

    clientSocket!.emit(actionName, {
      lid,
      data,
    });
  });
};

const request = async (
  ctx: Partial<SocketTestContext>,
  token: string | undefined,
  actionName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any = {}
): Promise<SocketTestResponse> => {
  return new Promise((resolve): void => {
    const clientSocket = io(`http://localhost:${configVars.port}`, {
      autoConnect: false,
      reconnection: false,
      transports: ['websocket'],
      query: {
        ...(token ? { token } : null),
      },
    });

    clientSocket.on('disconnect', () => {
      resolve({
        body: {},
        socket: {
          connected: clientSocket.connected,
          disconnected: clientSocket.disconnected,
        },
      });
      clientSocket.close();
    });

    clientSocket.connect();

    makeRequest(clientSocket, actionName, data).then(resolve);
  });
};

const subscribe = async (
  ctx: Partial<SocketTestContext>,
  token: string | undefined,
  actionName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb?: (request: (actionName: string, data: any) => Promise<SocketTestResponse>) => void
): Promise<SocketTestResponse> => {
  return new Promise((resolve): void => {
    const clientSocket = io(`http://localhost:${configVars.port}`, {
      autoConnect: false,
      reconnection: false,
      transports: ['websocket'],
      query: {
        ...(token ? { token } : null),
      },
    });

    clientSocket.on('disconnect', () => {
      resolve({
        body: {},
        socket: {
          connected: clientSocket.connected,
          disconnected: clientSocket.disconnected,
        },
      });
      clientSocket.close();
    });

    clientSocket.connect();

    clientSocket.on(actionName, (response: SocketResponse) => {
      resolve({
        body: response,
        socket: {
          connected: clientSocket.connected,
          disconnected: clientSocket.disconnected,
        },
      });
      clientSocket.off('disconnect');
      clientSocket.close();
    });

    if (typeof cb === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cb((cActionName: string, cData: any) => makeRequest(clientSocket, cActionName, cData, false));
    }
  });
};

const createContextMethods = (): SocketTestContext => {
  const sequelize = initSequelize();
  const express = initExpress(sequelize);
  const apiRequest = supertest(express);
  const httpServer = http.createServer(express);
  const socketServer = socketSetup(httpServer);

  const ctx: Partial<SocketTestContext> = {
    httpServer,
    socketServer,
    sequelize,
    apiRequest,
  };

  beforeAll((done): void => {
    httpServer.listen(configVars.port, done);
  });

  return {
    ...ctx,
    apiRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socketRequest: (token: string | undefined, actionName: string, data: any) => request(ctx, token, actionName, data),
    subscribe: (
      token: string | undefined,
      actionName: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cb: (request: (actionName: string, data: any) => Promise<SocketTestResponse>) => void
    ) => subscribe(ctx, token, actionName, cb),
  } as SocketTestContext;
};

export const withDatabase = (seedFile: string = 'default', runTests: (ctx: SocketTestContext) => void): void => {
  const contextMethods = createContextMethods();

  beforeEach(() => {
    execSync(`yarn seed:reset`, {
      stdio: 'inherit',
    });

    execSync(`yarn seed ${seedFile}`, {
      stdio: 'inherit',
    });
  });

  afterAll(async () => {
    await contextMethods.sequelize.close();
    await contextMethods.socketServer.close();
    await contextMethods.httpServer.close();
  });

  runTests(contextMethods);
};

export const withSingleDatabase = (seedFile: string = 'default', runTests: (ctx: SocketTestContext) => void): void => {
  const contextMethods = createContextMethods();

  beforeAll(() => {
    execSync(`yarn seed:reset`, {
      stdio: 'inherit',
    });

    execSync(`yarn seed ${seedFile}`, {
      stdio: 'inherit',
    });
  });

  afterAll(async () => {
    await contextMethods.sequelize.close();
    await contextMethods.socketServer.close();
    await contextMethods.httpServer.close();
  });

  runTests(contextMethods);
};
