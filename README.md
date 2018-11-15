# worldforge

## How to run

### Dev 

* Run ```npm install``` installs dependencies
* Run ```npm run watch``` which runs webpack in "watch" mode which makes a dev build when file changes are detected
* Run ```docker-compose up``` to start nodejs and other required services. 

Docker-compose is configured with volumes so it does not need to be restarted when a new build occurs.
Nodemon is used in the nodejs container to detect filechanges and restarts the nodejs process when changes occur.

### Prod

* Run ```npm install``` installs dependencies
* Run ```npm run build``` runs webpack to build a production ready js bundle
* Run ```docker-compose up``` to start nodejs and other required services.

> NOTE: the docker-compose still uses nodemon by default. Need to figure out how to change the startup command so that we can prevent installing some dev dependencies

## FAQ

### Bug reporting
Create a git issue and label as a bug

### Feature requests
Create a git issue and label as a new feature

### Contirbution Guide
Should probably make one of these
