<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<h1>Solar Applications</h1>

## Prerequisite

- Node `v20.2.0`
- MongoDB
- Docker & docker-compose (for running docker container)

## Project setup

Setup env

```bash
$ cp .env.example .env
```

Dont forget to update your mongodb url and other env vars in .env file.

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Seed database manually

```bash
$ npm run seed

```

## Run tests

```bash
# unit tests
$ npm run test

```

## Run with docker-compose

```bash
$ docker-compose up -d
```

running docker-compose it will do following things

- spin up mongodb
- seed mongodb database
- run Nest.js api server

## Access api server

Once the server up and running you can call api using following url http://localhost:3030/

visit http://localhost:3030/api for api documentation
