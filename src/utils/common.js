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

const regexGet = /\(\s*([^)]+),\s*([^)]+)\)\s+(in|of)\s+([^)]+)/;
const regexSet = /^(\w+) (in|of) (\w+|\d+)$/;
const getVForInTarget = (str) => {
  if (!str) return;
  const matchGet = str.match(regexGet); // 是否正确匹配 形如 (item,index) in/of list
  if (matchGet) {
    // 抽离 v-for 里的 item, index, list
    const [str, item, index, symbol, list] = matchGet;
    return {
      str,
      item,
      index,
      symbol,
      list,
    };
  } else {
    // 是否正确匹配 形如 item in/of list 没有写index的情况
    const matchSet = str.match(regexSet);
    if (matchSet) {
      const [str, item, symbol, list] = matchSet;
      return {
        str,
        item,
        index: undefined,
        symbol,
        list,
      };
    }
  }
};

module.exports = {
  isDirectory,
  getVueSourceFilePaths,
  getVForInTarget,
};
