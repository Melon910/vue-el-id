const { randomUUID } = require('node:crypto');
// carbon-footprint/tag/components/LCADetailShare.vue
// system/user/index.vue
// privacyPolicy.vue
module.exports = {
  input: './src/test/test1.vue',
  callBackFn: (tagname) => {
    // template 不加
    if (tagname === 'template') return {};
    // 首字母大写 视为组件 不加
    if (tagname[0] === tagname[0].toUpperCase()) return {};
    const randomStr = randomUUID().split('-').at(0);
    return {
      'dl-t': randomStr,
    };
  },
};
