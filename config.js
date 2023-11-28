const { randomUUID } = require('node:crypto');

module.exports = {
  input: './src/App.vue',
  callBackFn: (tagname) => {
    const randomStr = randomUUID().split('-').at(0);
    return {
      'dlt': randomStr,
    };
  },
};
