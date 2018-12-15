# worldforge

## How to install

### Requirements
* docker
* docker-compose
* make

### Dev

The dev instance of worldforge is configured to run with docker-compose by which other
requirements are met with.

### Production

```make install```

This command used is for Unix systems to provide a redundant installation of WorldForge.
This command installs a production ready build of the UI, the api server, and a systemd unit file to manage the service with.
The UI and server code are installed in `/srv/worldforge`.

This container reads the env file `/etc/worldforge/.env` for configuration.
`example.env` is an example of the supported configuration items and format of this file.

Once you install, there is little need for this cloned repo.

NOTE: The  mongodb and redis containers in the prod docker compose environment installed with this command have their persistent data
stored in the `worldforge/data/mongodb` and `worldforge/data/redis` directories.

NOTE: This command is not required if you want to run a production build of worldforge.
It is a convenience method for system administrators wanting to provide WorldForge as a service.

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

If a production build was not installed then:

```make prod```

and

```make down```

can be used to start and stop the worldforge service.

## FAQ

### What environment should I use?
The development environment is for those contributing to worldforge and need a non-persistent environment to test and develop with.

The production environment should be used by those wanting to provide worldforge as a service.
This build will be the fastest and provides persistent backing services.


### Bug reporting
Create a git issue and label as a bug

### Feature requests
Create a git issue and label as an enhancement

### Contribution Guide
Should probably make one of these
