import type { Tree } from '@nrwl/devkit';
import { generateFiles, joinPathFragments } from '@nrwl/devkit';
import type { NormalizedSchema } from '../generator';

export function createLibFiles(tree: Tree, options: NormalizedSchema): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    joinPathFragments(options.libraryRoot, 'src'),
    {
      tmpl: '',
    }
  );
}
