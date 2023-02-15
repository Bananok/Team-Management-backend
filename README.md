# Olga-finance timetracker backend 

## Specification
This project is a backend part for Olga Finance web app mainly in Typescript

Project documentation `https://www.notion.so/omsk-community/README-5db449337ca24a29be7006aaa12ef047`

Documentation for API timetracker `https://api.olga-finance.effective.band/docs/`

## Requirements

### To run the server

- NodeJS v.12+
- Yarn

### For development

- Docker (and docker-compose) or local Postgres server

## Commands

* `yarn dev` starts API dev server on `http://localhost:3010`
* `yarn start` starts API forever daemon on `http://localhost:3010`
* `yarn stop` stops API forever daemon
* `yarn logs` prints logs of API forever daemon
* `yarn build` converts typescript files (from `src` directory) to javascript files (to `dist` directory)
* `yarn lint` runs typescript linters (prettier + eslint)
* `yarn lint:fix` runs fixing using typescript linters
* `yarn lint:watch` runs real-time watching typescript linters

### Running dev server

#### Setup
Before running the dev server you need to:
- Run local postgres DB with `docker-compose -f docker-compose.dev.yml up`.
- Copy `.env.example` file to `.env` file in the root directory.
- Install modules for nodejs using the `yarn` command.

To run the dev server use: `yarn dev`.

The API documentation API documentation is available at `http://localhost:3010/docs`

### Running tests

#### Unit tests

To run unit tests use `yarn test`.

To run a specific unit test use: `yarn test -t "describeName itName"`.

To run a specific unit test file use: `yarn test --testMatch "**/__tests__/file-name.ts"`.

#### E2E tests

To run a local test DB for E2E tests use `docker-compose -f docker-compose.test.yml -p timetracker-test up`

To run E2E tests (uses the real database and tests actual server endpoints) use `yarn test:e2e`.

To run a specific E2E test use: `yarn test:e2e -t "describeName itName"`.

To run a specific E2E test file use: `yarn test:e2e --testMatch "<rootDir>/src/e2e/tests/**/file-name.spec.e2e.ts"`.

Before running E2E tests for the first time, and every time when the data model changes, or the e2e tests change, you need to update the test environment with `yarn test:e2e:setup`.

### Migrations

To run migrations use `yarn migrate`.

To reset and init all migrations use `yarn migrate:reset`.

To generate a new migration use `yarn migrate:generate <migration-name>`.

### Seeders
(for E2E tests only)

To run seeders `yarn seed`.

To run a specific seeder `yarn seed <seed-name>`.

To generate a new seeder `yarn seed:generate <seed-name>`.

## Deployment

Partially automated through CD (see the bitbucket deployment page):
push to deploy to `https://api.olga-finance.effective.band/` 

`git push origin develop`

However, if you need to build or deploy manually, you may run:

build for deployment with minification
`yarn build develop` or qa, or prod deploy to s3
`yarn deploy develop` or qa, or prod

## Directories

`./scripts/dev` - Dev scripts

`./src/api` - API logic

`./src/config` - Configs for API server

`./src/e2e` - E2E tests and helpers

`./src/interfaces` - Shared interfaces

`./src/migrations` - Migration scripts

`./src/models` - DB models

`./src/services` - Shared gateways with external services

`./src/socket` - Socket logic

`./src/types` - Global typescript interfaces 

`./src/utils` - Shared utils

`./uploads` - Local upload directory (for dev only)

`./ws-client` - Local web socket client (for dev only)

## External dependencies

- Typescript: `http://typescript-lang.ru/docs/Basic%20Types.html`

- ExpressJS: `https://expressjs.com/en/starter/hello-world.html`

- Sequelize ORM (for Postgres DB): `https://sequelize.org/docs/v6/getting-started/`

- Sequelize Typescript (typescript-addon for Sequelize): `https://www.npmjs.com/package/sequelize-typescript`

- Joi (validation): `https://joi.dev/api/`

- Docker: `https://www.youtube.com/watch?v=QF4ZF857m44`
