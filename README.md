# worldforge

## How to install

### Dev

#### Requirements
* docker
* docker-compose
* make

The dev instance of worldforge is configured to run with docker-compose by which other
requirements are met with.

### Production

#### Requirements
* docker
* docker-compose
* make
* mongodb
* redis

```make install```

This command installs a production ready build of the UI, the api server, and a systemd unit file to manage the server.

NOTE: The docker compose environment installed with this command does not install mongodb or redis.
These requirements need to be installed by other means.

This container reads the env file `/etc/worldforge/.env` for configuration.
`example.env` is an example of the supported configuration items and format of this file.

## How to run

### Dev

```make dev```

 Docker-compose is configured with volumes so it does not need to be restarted when a new build occurs.
Nodemon is used in the nodejs container to detect filechanges and restarts the nodejs process when changes occur.

:warning: Warning :warning:

The mongodb and redis container in the dev environment are not persistent.
Performing a `make down` will destroy any data in the database

### Production

If `make install` was used to install worldforge, systemd commands can be used to manage worldforge such as:

```systemctl start worldforge```

Otherwise:

```make prod```

and

```make down```

can be used to start and stop the worldforge service.

## FAQ

### What environment should I use?
The development environment is for those contributing to worldforge and do not mind a non-persistent environment.

The production environment should be used by those wanting to provide worldforge as a service.
This build will be the fastest and should be configured to point to a persistent mongodb and redis service.


### Bug reporting
Create a git issue and label as a bug

### Feature requests
Create a git issue and label as an enhancement

### Contribution Guide
Should probably make one of these
