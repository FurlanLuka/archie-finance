const { execSync } = require('child_process');
const core = require('@actions/core');

function getAffectedProjects() {
  const base = core.getInput('base');
  const printAffectedCommand = `npx nx affected:apps ${base ? `--base=${base}` : ''} --plain`;
  const affectedOutput = execSync(printAffectedCommand).toString().trim();

  return affectedOutput ? affectedOutput.split(' ') : [];
}

const run = () => {
  const affectedProjects = getAffectedProjects();

  core.setOutput('affectedProjects', affectedProjects);
  core.notice(`affectedProjects: ${affectedProjects}`);

  core.setOutput('isAffected', affectedProjects.length > 0);
  core.notice(`isAffected: ${affectedProjects.length > 0}`);

  const hasAffectedApi =
    affectedProjects.find((project) => project.indexOf('-api') > -1 && project.indexOf('-test-api') === -1) !==
    undefined;

  const hasAffectedUi = affectedProjects.find((project) => project.indexOf('ui-') > -1) !== undefined;

  const hasAffectedTestApi = affectedProjects.find((project) => project.indexOf('-test-api') > -1) !== undefined;

  core.setOutput('hasAffectedApi', hasAffectedApi);
  core.notice(`hasAffectedApi: ${hasAffectedApi}`);

  core.setOutput('hasAffectedUi', hasAffectedUi);
  core.notice(`hasAffectedUi: ${hasAffectedUi}`);

  core.setOutput('hasAffectedTestApi', hasAffectedTestApi);
  core.notice(`hasAffectedTestApi: ${hasAffectedTestApi}`);
};

run();
