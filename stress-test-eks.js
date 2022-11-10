#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function checkRequirements(debugEnabled) {
  try {
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

  try {
    await exec('go version');
  } catch {
    throw new Error('Go missing');
  }

  try {
    await exec('aws help');
  } catch {
    throw new Error('Aws cli missing');
  }
}

async function setupInfrastructureServices(debugEnabled) {
  try {
    console.log('Setting up helm...');
    await exec('helm repo add datadog https://helm.datadoghq.com');
    await exec('helm repo add bitnami https://charts.bitnami.com/bitnami');
    await exec('helm repo update');
    console.log('Helm setup completed ✅');

    console.log('Starting Datadog...');
    try {
      await exec(
        `helm upgrade --install datadog -f local/k6-cluster/datadog-values.yml datadog/datadog`,
      );
      console.log('Datadog running ✅');
    } catch (error) {
      console.error(
        'Datadog is not set up correctly ❌. Cluster will be set up without It...',
      );
    }

    console.log('Starting RabbitMQ...');
    await exec(
      `helm upgrade --install rabbitmq -f local/k6-cluster/rabbitmq-values.yml bitnami/rabbitmq`,
    );
    console.log('RabbitMQ running ✅');

    console.log('Starting PostgresSQL...');
    await exec(
      `helm upgrade --install postgresql -f local/k6-cluster/postgresql-values.yml bitnami/postgresql`,
    );
    console.log('PostgresSQL running ✅');

    console.log('Starting K6 operator...');
    await exec(
      'git clone https://github.com/grafana/k6-operator --depth 1 && cd k6-operator && make deploy && cd .. && rm -rf k6-operator',
    );
    console.log('K6 operator running ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error(
      'Issue while setting up infrastructure services, is your docker running?',
    );
  }
}

async function deployApi(service, build, debugEnabled) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const inputQuestion = util.promisify(readline.question).bind(readline);

  try {
    const platformTag = 'linux';
    const repositoryUrl =
      '108827241267.dkr.ecr.us-east-1.amazonaws.com/archie-testing-container-repository';

    const availableProfiles = (await exec('aws configure list-profiles'))
      .stdout;
    console.log('AWS profiles: ');
    console.log(availableProfiles);

    const awsProfile = await inputQuestion(
      `AWS profile for archie testing cluster: `,
    );

    if (build) {
      let dockerfilePath;
      if (service.endsWith('test-api')) {
        dockerfilePath = 'apps/tests';
      } else if (service.endsWith('api')) {
        dockerfilePath = 'apps/api';
      } else {
        throw new Error('Invalid service name');
      }

      console.log('Building service... (This might take a while)');
      await exec(
        `DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build -f ${dockerfilePath}/${service}/Dockerfile.local -t ${service}-${platformTag} --build-arg LOCAL=true .`,
      );
      console.log('Service built ✅');
    }

    console.log('Logging in the ECR repository');
    await exec(
      `aws ecr get-login-password --region=us-east-1 --profile=${awsProfile} | docker login --username AWS --password-stdin ${repositoryUrl}`,
    );
    console.log('Logged in ✅');

    console.log('Pushing docker image...');
    const imageTag = `${service}-${Date.now()}`;
    const ecrImageName = `${repositoryUrl}:${imageTag}`;
    await exec(`docker tag ${service}-${platformTag}:latest ${ecrImageName}`);
    await exec(`docker push ${ecrImageName}`);
    console.log(`Docker image pushed ✅. Image name: ${ecrImageName}`);

    console.log('Pushing docker image...');
    await exec(
      `helm upgrade --install ${service} local/k6-cluster/eks-deploy-chart --set environment=stress-test --set service=${service} --set tag=${imageTag} --set image=${repositoryUrl}`,
    );
    console.log(chalk.inverse.bold('Service deployed'));
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error(
      'Issue while deploying api, is your docker running? Try running command with --build argument to build the image. This is required first time and on any service updates',
    );
  }

  readline.close();
}

async function cleanupK6Script() {
  console.log(`Removing previous test config...`);
  try {
    await exec(
      'kubectl delete -f local/k6-cluster/k6-operator-custom-resource.yml',
    );
  } catch (error) {
    console.warn(
      'Error deleting k6 custom resource. This is expected in case you run this script on clean cluster',
      error.message,
    );
  }
  try {
    await exec('kubectl delete configmap stress-test');
  } catch (error) {
    console.warn(
      'Error stress test config map. This is expected in case you run this script on clean cluster',
      error.message,
    );
  }
  console.log(`Test config removed ✅`);
}

program
  .command('setup')
  .alias('s')
  .option('-d, --debug')
  .option('-b, --build')
  .action(async ({ debug, build }) => {
    console.log(chalk.inverse.bold(`Starting K6 cluster setup...`));
    try {
      await checkRequirements(debug);
      await setupInfrastructureServices(debug);
      await deployApi('utils-test-api', build, debug);
    } catch (error) {
      console.log(chalk.red.bold(error.message));
    }

    console.log(chalk.inverse.bold('K6 cluster setup complete ✅'));
  });

program
  .command('clean')
  .alias('c')
  .option('-d, --debug')
  .action(async ({ debug }) => {
    console.log(chalk.inverse.bold(`Starting cluster cleanup...`));
    await cleanupK6Script();

    try {
      console.log('Uninstalling K6 operator...');
      await exec(
        'git clone https://github.com/grafana/k6-operator --depth 1 && cd k6-operator && make delete && cd .. && rm -rf k6-operator',
      );
      console.log('K6 operator uninstalled ✅');
    } catch (error) {
      await exec('cd .. && rm -rf k6-operator');
      console.error('K6 operator could not be cleaned ❌', error);
    }

    try {
      console.log('Uninstalling all Helm services...');
      await exec('helm uninstall $(helm list --short)');
      console.log('All services uninstalled ✅');
    } catch (error) {
      console.error('Services could not be cleaned ❌', error);
    }

    console.log(chalk.inverse.bold('Cluster cleanup complete'));
  });

program
  .command('deploy')
  .alias('d')
  .option('-d, --debug')
  .option('-b, --build')
  .requiredOption('-s, --service <service>', 'Service name')
  .action(async ({ debug, build, service }) => {
    await deployApi(service, build, debug);
  });

program
  .command('run')
  .requiredOption(
    '-s, --script <script>',
    'Path to script to build and execute',
  )
  .option('-d, --debug')
  .action(async ({ script, debug }) => {
    const scriptPath = `apps/tests/stress/src/${script}`;

    try {
      await cleanupK6Script();

      console.log(`Building script at path: ${scriptPath}`);
      await exec(
        `nx run stress-tests:build --main=${scriptPath} --skip-nx-cache`,
      );
      console.log(`Script built ✅`);

      console.log(`Starting script`);
      await exec(
        'kubectl create configmap stress-test --from-file dist/apps/tests/stress/main.js --from-file dist/apps/tests/stress/main.js.map',
      );

      await exec(
        'kubectl apply -f local/k6-cluster/k6-operator-custom-resource.yml',
      );
      console.log(`Script started ✅. Check kubernetes pods for more info.`);
    } catch (error) {
      console.log(chalk.red.bold(error.message));
    }
  });

program
  .command('stop')
  .option('-d, --debug')
  .action(async ({ debug }) => {
    console.log(`Stopping test execution...`);
    await cleanupK6Script();

    console.log(`Script stopped ✅`);
  });

program.parse();
