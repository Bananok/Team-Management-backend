import { execSync } from 'child_process';
import { Sequelize } from 'sequelize';
import supertest from 'supertest';

// Configs
import initExpress from 'config/express';
import initSequelize from 'config/sequelize';

jest.mock('services/logger');

interface ApiTestContext {
  request: supertest.SuperTest<supertest.Test>;
  sequelize: Sequelize;
}

const createContextMethods = (): ApiTestContext => {
  const sequelize = initSequelize();
  const express = initExpress(sequelize);
  const request = supertest(express);

  return {
    request,
    sequelize,
  };
};

export const withDatabase = (seedFile: string = 'default', runTests: (ctx: ApiTestContext) => void): void => {
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
  });

  runTests(contextMethods);
};

export const withSingleDatabase = (seedFile: string = 'default', runTests: (ctx: ApiTestContext) => void): void => {
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
  });

  runTests(contextMethods);
};
