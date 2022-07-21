import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import { MicroserviceModuleGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/nest';
import { Linter } from '@nrwl/linter'

interface NormalizedSchema extends MicroserviceModuleGeneratorSchema {
  serviceRoot: string;
  libraryRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: MicroserviceModuleGeneratorSchema,
): NormalizedSchema {
  const serviceRoot = `${getWorkspaceLayout(tree).appsDir}/${
    options.projectName
  }`;

  const libraryRoot = `${getWorkspaceLayout(tree).libsDir}/api/${
    options.projectName
  }`;

  return {
    ...options,
    serviceRoot,
    libraryRoot,
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
  options: MicroserviceModuleGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options);

  await libraryGenerator(tree, {
    name: normalizedOptions.name,
    standaloneConfig: true,
    buildable: false,
    controller: false,
    directory: `api/${normalizedOptions.projectName}`,
    importPath: `@archie/api/${normalizedOptions.projectName}/${normalizedOptions.name}`,
    linter: Linter.EsLint,
    service: true,
    publishable: false,
  });

  // visitNotIgnoredFiles(tree, `${normalizedOptions.serviceRoot}/src/`, (path) => console.log(path))

  // addFiles(tree, normalizedOptions);
}
