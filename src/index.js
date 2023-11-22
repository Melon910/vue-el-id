const fs = require('fs-extra');
const path = require('node:path');
const { exit } = require('node:process');
const cliProgress = require('cli-progress');
const { getVueSourceFilePaths } = require('./utils/common.js');
const { transformVue } = require('./core.js');
const configFilePath = path.resolve(path.join(process.cwd(), 'config.js'));

if (!fs.existsSync(configFilePath)) {
  console.log('配置文件不存在');
  exit(1);
} else {
  const config = require(configFilePath);
  const { input, callBackFn } = config;
  const filePathList = getVueSourceFilePaths(input);
  if (input) {
    const bar = new cliProgress.SingleBar(
      {
        format: `执行进度: [{bar}] {percentage}% {value}/{total}`,
      },
      cliProgress.Presets.shades_classic
    );
    let length = filePathList.length;
    bar.start(length, 0);
    filePathList.forEach(async (filePath) => {
      const sourceCode = fs.readFileSync(filePath, 'utf8');
      const { code } = await transformVue(sourceCode, filePath, callBackFn);
      fs.writeFileSync(filePath, code, 'utf8');
      bar.increment();
      length--;
      if (length === 0) {
        bar.stop();
      }
    });
  }
}
