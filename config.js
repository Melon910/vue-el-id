const { randomUUID } = require('node:crypto');

module.exports = {
  input: './src/test.vue',
  callBackFn: (tagname) => {
    const randomStr = randomUUID().split('-').at(0);
    return {
      'dlt': randomStr,
    };
  },
};
