import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';
import type { NormalizedSchema } from '../generator';

export function updateTsConfig(tree: Tree, options: NormalizedSchema): void {
  updateJson(
    tree,
    joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    (json) => {
      json.compilerOptions.emitDecoratorMetadata = true;
      json.compilerOptions.target = 'es2015';
      return json;
    },
  );
}
