const { randomUUID } = require('node:crypto');
// carbon-footprint/tag/components/LCADetailShare.vue
// system/user/index.vue
// privacyPolicy.vue
module.exports = {
  input: './src/components',
  callBackFn: (tagname) => {
    const randomStr = randomUUID().split('-').at(0);
    return {
      'dl-t': randomStr,
    };
  },
};
