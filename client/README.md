# MyFeeds Client

> React app for MyFeeds.

## Getting started

* Install Node dependencies: `yarn`
* [Set the environment variables](#environment)
* Run the app: `yarn start`
* Listening on: [`http://0.0.0.0:3000`](http://0.0.0.0:3000)

## Development setup

### Environment

| Variable                | Default            | Description               |
|-------------------------|--------------------|---------------------------|
| `REACT_APP_SERVER_HOST` | "http://localhost" | The address of the server |
| `REACT_APP_SERVER_PORT` | 9000               | The port of the server    |

To set MyFeeds's environment variables, duplicate the file [`.env.sample`](.env.sample) and rename it [`.env`](.env). Provide your settings in the latter, which will never be committed.

### Commands

* Watch: `yarn start`
* Format code: `yarn format`
