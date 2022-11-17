# ArchieMicroservices

This project was generated using [Nx](https://nx.dev).

# Local deployment

### Requirements

- Docker desktop ([https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/))
- Minikube ([https://minikube.sigs.k8s.io/docs/](https://minikube.sigs.k8s.io/docs/))
  - Install it with homebrew ([https://formulae.brew.sh/formula/minikube](https://formulae.brew.sh/formula/minikube))
- Kubectl
  - Install it with homebrew ([https://formulae.brew.sh/formula/kubernetes-cli](https://formulae.brew.sh/formula/kubernetes-cli))
- Mysql
  - Install it with homebrew ([https://formulae.brew.sh/formula/mysql](https://formulae.brew.sh/formula/mysql))

## Installation steps

### 1. Run Hashicorp Vault in docker

Vault has been already been configured, and its configuration is saved inside the local/vault folder. In order to deploy the local instance of the vault run command `docker-compose up` from within the vault configuration folder.

### 2. Add minikube url to the hosts file

Because services that run in Minikube can't access localhost directly, they use `host.minikube.internal` url to access the localhost. Add `127.0.0.1 host.minikube.internal` to hosts file (/etc/hosts) the minikube url to your localhost. This is required because when you locally deploy microservices, it uses .env files for config, and by mapping the minikube url to localhost, you don't have to change .env from localhost to minikube url every time you have to deploy and test everything locally.

### 3. Setup environment variables

Each microservice has its own set of environment variables, by default they are all located in env.dev files. Rename this file to .env and update variables that are specific to your machine (database details)

### 4. Deploy microservices locally

In order to do that, navigate to the root of archie-microservices and execute `node ./deploy-localhost.js i` command. (To add console debug messages add `-d` flag). This command will build docker images of all services and deploy them into local minikube environment.

Note that every time this command is ran, the environment will be purged and set up again from scratch.

### 5. Update microservice

To update microservice run `node ./deploy-localhost.js u -s user-api`. `-s` flag represents service that you want to update. (Same debug flag applies as for initial deploy command).

### 5. Map cluster url to localhost

Minikube has issue with ingress that makes it impossible to access ingress endpoints. Thankfully there is a work around for this issue (https://github.com/kubernetes/minikube/issues/7332#issuecomment-890110258)

First run this command to get the minikube port `docker port minikube | grep 22` the response will look something like `22/tcp -> 127.0.0.1:50341`
Now that we know minikube port we can map it to our localhost:3000 using this command `sudo ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -N docker@127.0.0.1 -p <minikube_port> -i /Users/<user>/.minikube/machines/minikube/id_rsa -L 3000:127.0.0.1:80` - Replace <minikube-port> with the port returned from docker port command and <user> with your username. After this is running, your local cluster should be accessable through localhost:3000.

# Local stress test execution deployment (Minikube)

## Installation steps

### 1. Add minikube url to the hosts file

Because services that run in Minikube can't access localhost directly, they use `host.minikube.internal` url to access the localhost. Add `127.0.0.1 host.minikube.internal` to hosts file (/etc/hosts) the minikube url to your localhost. This is required because when you locally deploy microservices, it uses .env files for config, and by mapping the minikube url to localhost, you don't have to change .env from localhost to minikube url every time you have to deploy and test everything locally.

### 2. Setup environment variables

Each microservice has its own set of environment variables, by default they are all located in env.dev files. Rename this file to .env and update variables that are specific to your machine (database details). For the stress tests uncomment env variables located under comment `# Stress test config`.
Env for the api located under `tests/utils-test-api` **must** be set in order for any script to work.

### 3. Setup datadog agent (Optional)

Datadog helm values are located under `local/k6-cluster/datadog-values.example.yml`. Copy the file as `local/k6-cluster/datadog-values.yml` and add required api keys.

### 4. Setup K6 cluster

Run the setup script using `node ./stress-test-minikube.js setup -d`.

### 5. Deploy required services

Deploy services that the wished script is testing using command `node ./deploy-localhost.js u -s <service-name> -d`. For the script `onboarding/full-onboarding.ts` the service is called `onboarding-api`.

### 6. Prepare custom k6 settings

K6 settings are located under: `local/k6-cluster/k6-operator-custom-resource.yml`. Most of the time only API_BASE_URL env needs to be changed.

### 7. Run the script

To run the script execute the following command `node ./stress-test-minikube.js run --script=onboarding/full-onboarding.ts`. As result of the script, new Kubernetes pods should be spawned, which should be observed and succeed.

### 8. Cleanup (Optional)

K6 is cleaned up every time, the `./stress-test-minikube.js run` command is executed. Clean up can also be accomplished by running `kubectl delete -f local/k6-cluster/k6-operator-custom-resource.yml`

# EKS stress test deployment

### 1. Setup infrastructure (Optional)

In case the cluster is empty or missing some resources deployed run: `node ./stress-test-eks.js setup -d`. In case this is the first time you are running this command or the test-api-service was updated also add `--build` argument

### 2. Deploy tested services

Deploy services using `node ./stress-test-eks.js deploy --service=<service_name> -d --build`.

### 3. Run the stress test

After all services are deployed, test can be ran using: `node ./stress-test-eks.js run --script=<path to script>`

### 4. Stop the script (Optional)

In case you want to stop the script during the execution run: `node ./stress-test-eks.js stop`

### 5. Cleanup the cluster

After you are finished with testing run `node ./stress-test-eks.js clean`. The command will clean up all the resources. Some "Not found" errors during this command are expected. Please check running pods to validate that the services were cleaned up.


# ArchieWebapps

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@archie-webapps/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
