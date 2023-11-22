const { parse } = require('@vue/compiler-sfc');
const htmlparser2 = require('htmlparser2');
const prettier = require('prettier');

function parseTagAttribute(attributes) {
  let attrs = '';
  for (const key in attributes) {
    const attrValue = attributes[key];
    if (attrValue === undefined || attrValue === true) {
      attrs += ` ${key} `;
    } else {
      attrs += ` ${key}="${attrValue}" `;
    }
  }
  return attrs;
}

async function formatCode(code, prettierConfig = {}) {
  let stylizedCode = code;
  stylizedCode = await prettier.format(code, {
    ...prettierConfig,
    parser: 'vue',
  });
  return stylizedCode;
}

// 处理模板
function handleTemplate(template, cb = () => {}) {
  const { type, content } = template;
  // 解析模板代码，返回描述符和错误数组
  if (!template || template.content.trim() === '') {
    throw new Error(`文件${sourceFilePath}缺少模板内容`);
  }
  let htmlString = `<${type}>`;
  const parser = new htmlparser2.Parser({
    onopentag(tagname, attributes) {
      console.log('tagname',tagname);
      const cbResult = cb(tagname);
      // 传入标签上已有的attr和生成的attr
      // attributes会覆盖cbResult生成的attr 旧的attr会一直在
      const attr = `${parseTagAttribute({ ...cbResult, ...attributes })}`;
      htmlString += `<${tagname} ${attr}>`;
    },
    ontext(text) {
      htmlString += text;
    },
    onclosetag(tagname, isImplied) {
      // 自闭合标签
      if (isImplied) {
        htmlString = htmlString.slice(0, htmlString.length - 2) + '/>';
        return;
      }
      htmlString += `</${tagname}>`;
    },
    // 注释直接拼接
    oncomment(comment) {
      htmlString += `<!--${comment}-->`;
    },
  });
  parser.write(content);
  parser.end();
  htmlString += `</${type}>`;
  return htmlString;
}
function handleScript(script) {
  const { type, content, attrs } = script;
  let scriptCode = `<${type}`;
  scriptCode += parseTagAttribute(attrs);
  scriptCode += '>';
  scriptCode += content;
  scriptCode += `</${type}>`;
  return scriptCode;
}

function handleStyle(style) {
  const { type, content, attrs } = style;
  let styleCode = `<${type}`;
  styleCode += parseTagAttribute(attrs);
  styleCode += '>';
  styleCode += content;
  styleCode += `</${type}>`;
  return styleCode;
}
exports.transformVue = async function (code, sourceFilePath, cb) {
  // 解析模板代码，返回描述符和错误数组
  const { descriptor, errors } = parse(code);
  if (errors.length > 0) {
    const positon = errors[0].loc.start;
    throw new Error(
      `文件${sourceFilePath}在第${positon.line}行第${positon.column}列出错`,
      errors[0].toString()
    );
  }
  // 从描述符中获取模板
  const { template, script, scriptSetup, styles } = descriptor;
  let templateCode = '';
  let scriptCode = '';
  let stylesCode = '';
  if (template) {
    templateCode = handleTemplate(template, cb);
  }
  if (scriptSetup || script) {
    scriptCode = handleScript(scriptSetup || script);
  }
  if (styles) {
    for (const style of styles) {
      stylesCode += handleStyle(style);
    }
  }
  const codeStr = await formatCode(
    `${templateCode} \n${scriptCode} \n${stylesCode}`
  );
  return {
    code: codeStr,
  };
};
