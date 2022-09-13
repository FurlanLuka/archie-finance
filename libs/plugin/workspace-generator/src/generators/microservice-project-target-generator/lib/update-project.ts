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

      json = {
        ...json,
        targets: {
          ...json.targets,
          ...target,
        },
      };

      json.targets.build.options.tsPlugins = ['@nestjs/swagger/plugin'];

      return json;
    },
  );
}
