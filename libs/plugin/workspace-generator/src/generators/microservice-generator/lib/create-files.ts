import type { Tree } from '@nrwl/devkit';
import { generateFiles, joinPathFragments } from '@nrwl/devkit';
import type { NormalizedSchema } from '../generator';

export function createAppFiles(tree: Tree, options: NormalizedSchema): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files/app'),
    joinPathFragments(options.projectRoot, 'src'),
    {
      tmpl: '',
      projectName: options.name,
      root: options.projectRoot,
    }
  );
}
