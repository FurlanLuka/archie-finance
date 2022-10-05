import type { Tree } from '@nrwl/devkit';
import { joinPathFragments } from '@nrwl/devkit';
import type { NormalizedSchema } from '../generator';

export function deleteFiles(tree: Tree, options: NormalizedSchema): void {
  const filesFolder = joinPathFragments(options.libraryRoot, 'src', 'lib');
  const files = tree.children(filesFolder);

  files.forEach((file) => tree.delete(`${filesFolder}/${file}`));
}
