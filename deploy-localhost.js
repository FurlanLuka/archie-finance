const { program, CommanderError } = require('commander');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');
const clear = require('clear');

async function checkRequirements(debugEnabled) {
  try {
    await exec('minikube');
  } catch {
    throw new Error('Minikube missing');
  }

  try {
    await exec('eval $(minikube -u minikube docker-env)');
    await exec('docker info');
  } catch {
    throw new Error('Docker missing or not running');
  }

  try {
    await exec('helm');
  } catch {
    throw new Error('Helm missing');
  }

  try {
    await exec('kubectl');
  } catch {
    throw new Error('Kubectl missing');
  }
}

async function setupCluster(debugEnabled) {
  try {
    console.log('Deleting old cluster...');
    await exec('minikube delete');
    console.log('Cluster deleted ✅');
    console.log('Setting up fresh cluster...');
    await exec('minikube start');
    console.log('Cluster created ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up cluster, is your docker running?');
  }
}

async function cleanup(debugEnabled) {
  try {
    console.log('Cleaning up...');
    await exec('eval $(minikube -u minikube docker-env)');
    console.log('Cleaned up ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up docker, is your docker running?');
  }
}

async function getMicroservices(debugEnabled) {
  try {
    const { stdout } = await exec('ls apps/api');

    const microservices = stdout
      .split(/\r?\n/)
      .filter((service) => service.length > 0);

    if (debugEnabled) {
      console.log('Microservices ', microservices);
    }

    return microservices;
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while listing microservices');
  }
}

async function buildMicroservices(microservices, debugEnabled) {
  try {
    const buildCommands = [];

    for (let i = 0; i < microservices.length; i++) {
      const microservice = microservices[i];

      buildCommands.push(
        `docker build -f ./apps/api/${microservice}/Dockerfile.local -t ${microservice} --build-arg LOCAL=true .`,
      );
    }

    console.log(
      `Building ${
        microservices.length === 1 ? 'microservice' : 'microservices'
      }...(this might take a while)`,
    );

    if (debugEnabled) {
      console.log(
        `eval $(minikube docker-env) ${buildCommands
          .map((command) => `&& ${command}`)
          .join(' ')}`,
      );
    }

    await exec(
      `eval $(minikube docker-env) ${buildCommands
        .map((command) => `&& ${command}`)
        .join(' ')}`,
    );

    console.log('Build successful ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(JSON.stringify(error, null, 2));
    }
    throw new Error('Error while building microservices');
  }
}

async function deployMicroservices(microservices, debugEnabled) {
  try {
    for (let i = 0; i < microservices.length; i++) {
      const microservice = microservices[i];

      console.log(`Deploying ${microservice}...`);

      await exec(
        `helm upgrade --install ${microservice} charts/node-service --values charts/node-service/values.yaml --values charts/node-service/development.values.yaml --values apps/api/${microservice}/deployment/values.yaml --values apps/api/${microservice}/deployment/development.values.yaml --set tag=latest --set image=${microservice} --set local=true --set environment=local --set autoscaling.enabled=false --set service.command="node service/main.js"  --force`,
      );
      console.log(`${microservice} deployed ✅`);
    }
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying microservices');
  }
}

async function deployIngressController(install = true, debugEnabled) {
  try {
    console.log('Enabling ingress controller...');
    if (install) {
      await exec('minikube addons enable ingress');
      await sleep(30000);
      console.log('Ingress controller enabled ✅');
    }

    console.log('Installing ingress controller');
    await exec(
      'helm upgrade --install ingress charts/ingress-controller --set local=true',
    );
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while deploying ingress controller');
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

program
  .command('install')
  .alias('i')
  .option('-d, --debug')
  .action(async ({ debug }) => {
    clear();

    console.log(
      chalk.inverse.bold('Starting local microservice deployment...'),
    );

    try {
      await checkRequirements(debug);
      await setupCluster(debug);
      const microservices = await getMicroservices(debug);
      await buildMicroservices(microservices, debug);
      await deployMicroservices(microservices, debug);
      await deployIngressController(debug);
    } catch (error) {
      console.log(chalk.red.bold(error.message));
    }

    await cleanup();
  });

program
  .command('upgrade')
  .alias('u')
  .requiredOption('-s, --service <service>', 'service that should be upgraded')
  .option('-d, --debug')
  .action(async ({ service, debug }) => {
    console.log(chalk.inverse.bold(`Starting ${service} upgrade...`));

    if (service === 'ingress') {
      await deployIngressController(false, debug);
    } else {
      const microservices = await getMicroservices();

      if (!microservices.includes(service)) {
        console.log(chalk.red.bold('Service does not exist. Aborting ❌'));

        return;
      }

      await buildMicroservices([service], debug);
      await deployMicroservices([service], debug);
    }
    console.log(chalk.inverse.bold('Upgrade completed ✅'));
  });

program.parse();
