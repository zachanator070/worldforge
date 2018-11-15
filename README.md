# worldforge

## Requirements

### Required
* docker
* docker-compose

### Optional
* make (convenience methods for developing)


## How to run

### Dev 

```docker-compose up -d dev && docker-compose logs```

or

```make dev```

> Docker-compose is configured with volumes so it does not need to be restarted when a new build occurs.
Nodemon is used in the nodejs container to detect filechanges and restarts the nodejs process when changes occur.

### Prod

```docker-compose up -d prod```

or

```make prod```


## FAQ

### Bug reporting
Create a git issue and label as a bug

### Feature requests
Create a git issue and label as an enhancement

### Contribution Guide
Should probably make one of these
