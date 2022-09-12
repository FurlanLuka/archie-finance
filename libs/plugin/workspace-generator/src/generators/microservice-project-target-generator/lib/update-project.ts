import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';
import type { NormalizedSchema } from '../generator';
import { generateTarget } from './generate-target';

export function updateProjectConfiguration(
  tree: Tree,
  options: NormalizedSchema,
): void {
  updateJson(
    tree,
    joinPathFragments(options.projectRoot, 'project.json'),
    (json) => {
      const target = generateTarget(options.projectName);

      // const targetKeys = Object.keys(target);

      // targetKeys.forEach((key) => {
      //   json[key] = undefined;
      // })

      json = {
        ...json,
        targets: {
          ...json.targets,
          ...target,
        },
      };

      return json;
    },
  );
}
