# MyFeeds Server

> Server for MyFeeds.

## Getting started

* Install Node dependencies: `yarn`
* [Set the environment variables](#environment)
* Run the server: `yarn start`
* Listening on: [`http://0.0.0.0:9000`](http://0.0.0.0:9000)

## Development setup

### Environment

| Variable      | Default     | Description                          |
|---------------|-------------|--------------------------------------|
| `SERVER_HOST` | "localhost" | The address of the server            |
| `SERVER_PORT` | 9000        | The port of the server               |
| `DB_HOST`     | ""          | The address of the MongoDB database  |
| `DB_PORT`     | ""          | The port of the MongoDB database     |
| `DB_NAME`     | ""          | The name of the MongoDB database     |
| `DB_USER`     | ""          | The user of the MongoDB database     |
| `DB_PASSWORD` | ""          | The password of the MongoDB database |

To set MyFeeds's environment variables, duplicate the file [`.env.sample`](.env.sample) and rename it [`.env`](.env). Provide your settings in the latter, which will never be committed.

### Commands

* Watch: `yarn dev`

## Database scripts

All the scripts to set up the database are located in [`scripts/db/`](scripts/db/).

### Commands

* Reinitialize the database: `yarn db:init`
* Populate the database: `yarn db:populate`
