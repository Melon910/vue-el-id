const fs = require('fs-extra');
const { globSync } = require('glob');

const isDirectory = (source) => {
  return fs.lstatSync(source).isDirectory();
};

const getVueSourceFilePaths = (input) => {
  if (!isDirectory(input)) {
    return globSync(`${input}`);
  }
  return globSync(`${input}/**/*.vue`, { ignore: 'node_modules/**' });
};

module.exports = {
  isDirectory,
  getVueSourceFilePaths,
};

