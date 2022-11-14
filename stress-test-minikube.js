#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

  try {
    await exec('go');
  } catch {
    throw new Error('Go missing');
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
        `helm install datadog -f local/k6-cluster/datadog-values.yml datadog/datadog`,
      );
      console.log('Datadog running ✅');
    } catch (error) {
      console.error(
        'Datadog is not set up correctly ❌. Cluster will be set up without It...',
      );
    }

    console.log('Starting Kubernetes metrics server...');
    await exec(
      `helm upgrade --install metrics-server -f local/k6-cluster/metrics-server.values.yml bitnami/metrics-server`,
    );
    console.log('Metrics server running ✅');

    console.log('Starting RabbitMQ...');
    await exec(
      `helm install rabbitmq -f local/k6-cluster/rabbitmq-values.yml bitnami/rabbitmq`,
    );
    console.log('RabbitMQ running ✅');

    console.log('Starting K6 operator...');
    await exec(
      'git clone https://github.com/grafana/k6-operator --branch v0.0.7 --depth 1 && cd k6-operator && make deploy && cd .. && rm -rf k6-operator',
    );
    console.log('K6 operator running ✅');

    console.log('Starting PostgresSQL...');
    await exec(
      `helm upgrade --install postgresql -f local/k6-cluster/postgresql-values.yml bitnami/postgresql`,
    );
    console.log('PostgresSQL running ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error(
      'Issue while setting up infrastructure services, is your docker running?',
    );
  }
}

async function setupTestUtilApi(debugEnabled) {
  try {
    console.log('Building utils test api... (this might take a while)');
    const utilsTestApiMicroservice = 'utils-test-api';
    await exec(
      `eval $(minikube docker-env) && docker build -f apps/tests/utils-test-api/Dockerfile.local -t ${utilsTestApiMicroservice} --build-arg LOCAL=true .`,
    );
    console.log('Build successful ✅');

    console.log('Starting utils test api...');
    await exec(
      `helm upgrade --install ${utilsTestApiMicroservice} local/k6-cluster/eks-deploy-chart --set environment=stress-test --set service=${utilsTestApiMicroservice} --set tag=latest --set image=${utilsTestApiMicroservice}`,
    );

    console.log('Utils test api running ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error(
      'Issue while setting up infrastructure services, is your docker running?',
    );
  }
}

async function deployIngress(debugEnabled) {
  await exec('node ./deploy-localhost upgrade -s ingress -d');
}

program
  .command('setup')
  .alias('s')
  .option('-d, --debug')
  .action(async ({ debug }) => {
    console.log(chalk.inverse.bold(`Starting K6 cluster setup...`));
    try {
      await checkRequirements(debug);
      await setupCluster(debug);
      await Promise.all([
        setupInfrastructureServices(debug),
        setupTestUtilApi(debug),
      ]);
      await deployIngress(debug);
    } catch (error) {
      console.log(chalk.red.bold(error.message));
    }

    console.log(chalk.inverse.bold('K6 cluster setup complete ✅'));
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

program.parse();
