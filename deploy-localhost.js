const { program, CommanderError } = require('commander');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');
const clear = require('clear');

program
  .requiredOption(
    '-e, --exclude <app>',
    'app that should be excluded from the deployment',
  )
  .option('-d, --debug');

program.parse();

const { exclude, debug: debugEnabled } = program.opts();

async function checkRequirements() {
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

async function setupCluster() {
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

async function connectDocker() {
  try {
    console.log('Setting up docker environment');
    await exec('eval $(minikube docker-env)');
    console.log('Docker environment setup ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up docker, is your docker running?');
  }
}

async function cleanup() {
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

async function getMicroservices() {
  try {
    const { stdout } = await exec('ls apps');

    const microservices = stdout
      .split(/\r?\n/)
      .filter((service) => service.length > 0 && service !== exclude);

    if (debugEnabled) {
      console.log('Microservices to be deployed', microservices);
    }

    return microservices;
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while listing microservices');
  }
}

async function buildMicroservices(microservices) {
  try {
    const buildCommands = [];

    for (let i = 0; i < microservices.length; i++) {
      const microservice = microservices[i];

      console.log(`Building ${microservice}...`);
      buildCommands.push(
        `docker build -f ./apps/${microservice}/Dockerfile -t ${microservice} --build-arg LOCAL=true .`,
      );
      console.log('Build successful ✅');
    }

    console.log(
      `eval $(minikube docker-env) ${buildCommands
        .map((command) => `&& ${command}`)
        .join(' ')}`,
    );

    await exec(
      `eval $(minikube docker-env) ${buildCommands
        .map((command) => `&& ${command}`)
        .join(' ')}`,
    );
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Error while building microservices');
  }
}

(async () => {
  clear();

  console.log(chalk.inverse.bold('Starting local microservice deployment...'));

  try {
    await checkRequirements();
    await setupCluster();
    // await connectDocker();
    const microservices = await getMicroservices();
    await buildMicroservices(microservices);
  } catch (error) {
    console.log(chalk.red.bold(error.message));
  }

  await cleanup();
})();
