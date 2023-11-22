const { randomUUID } = require('node:crypto');

module.exports = {
  input: './vue-demo/src/App.vue',
  callBackFn: (tagname) => {
    const randomStr = randomUUID().split('-').at(-1);
    return {
      'dl-t': randomStr,
    };
  },
};
