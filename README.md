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
