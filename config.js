import { randomUUID } from 'node:crypto';

export default {
  input: './vue-demo',
  callBackFn: (tagname) => {
    const randomStr = randomUUID().split('-').at(-1);
    return {
      'dl-t': randomStr,
    };
  },
};
