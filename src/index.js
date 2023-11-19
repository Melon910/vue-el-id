import fs from 'fs-extra';
import path from 'node:path';
import { exit } from 'node:process';
import cliProgress from 'cli-progress';

import { getVueSourceFilePaths } from './utils/common.js';
import transformVue from './core.js';

const configFilePath = path.resolve(path.join(process.cwd(), 'config.js'));
if (!fs.existsSync(configFilePath)) {
  console.log('配置文件不存在');
  exit(1);
} else {
  import('../config.js')
    .then(async (res) => {
      const { input, callBackFn } = res.default;
      const filePathList = getVueSourceFilePaths(input);
      if (input && callBackFn) {
        const bar = new cliProgress.SingleBar(
          {
            format: `执行进度: [{bar}] {percentage}% {value}/{total}`,
          },
          cliProgress.Presets.shades_classic
        );
        bar.start(filePathList.length, 0);
        for await (const filePath of filePathList) {
          const sourceCode = fs.readFileSync(filePath, 'utf8');
          const { code } = await transformVue(sourceCode, filePath, callBackFn);
          fs.writeFileSync(filePath, code, 'utf8');
          bar.increment();
        }
        bar.stop();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
export default {};
