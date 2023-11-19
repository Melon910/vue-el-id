import fs from 'fs-extra';
import { globSync } from 'glob';

const isDirectory = (source) => {
  return fs.lstatSync(source).isDirectory();
};

export const getVueSourceFilePaths = (input) => {
  if (!isDirectory(input)) {
    return globSync(`${input}`);
  }
  return globSync(`${input}/**/*.vue`, { ignore: 'node_modules/**' });
};
