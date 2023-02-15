import defaultConfig from './jest.config';

export default {
  ...defaultConfig,
  testMatch: ['<rootDir>/src/e2e/**/?(*.)+(spec|test).e2e.[tj]s?(x)'],
  clearMocks: false,
};
