import {
  getWorkspaceLayout,
  Tree,
} from '@nrwl/devkit';
import { MicroserviceGenerator } from './schema';
import { applicationGenerator } from '@nrwl/nest'

interface NormalizedSchema extends MicroserviceGenerator {
  serviceRoot: string;
  constantsRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: MicroserviceGenerator,
): NormalizedSchema {
  const serviceRoot = `${getWorkspaceLayout(tree).appsDir}/${
    options.projectName
  }`;

  const constantsRoot = `${getWorkspaceLayout(tree).libsDir}/${
    options.projectName
  }/constants`;

  return {
    ...options,
    serviceRoot,
    constantsRoot
  };
}

// function addFiles(tree: Tree, options: NormalizedSchema) {
//   const templateOptions = {
//     ...options,
//     offsetFromRoot: offsetFromRoot(options.projectRoot),
//   };
//   generateFiles(
//     tree,
//     path.join(__dirname, 'files'),
//     options.projectRoot,
//     templateOptions,
//   );
// }

export default async function (
  tree: Tree,
  options: MicroserviceGenerator,
) {
  const normalizedOptions = normalizeOptions(tree, options);

  await applicationGenerator(tree, {
    name: 'test',
    standaloneConfig: true,
  });

  // visitNotIgnoredFiles(tree, `${normalizedOptions.serviceRoot}/src/`, (path) => console.log(path))

  // addFiles(tree, normalizedOptions);
}
