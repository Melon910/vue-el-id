const { parse } = require('@vue/compiler-sfc');
const htmlparser2 = require('htmlparser2');
const prettier = require('prettier');
const { getVForInTarget } = require('./utils/common');

function handleTemplateAttribute(cbResult, attributes) {
  // 属性上没有v-for 直接返回 无需处理
  if (attributes && !Object.hasOwn(attributes, 'v-for')) return cbResult;

  const newCbResult = {};
  for (const key in cbResult) {
    if (Object.hasOwnProperty.call(cbResult, key)) {
      newCbResult[`:${key}`] = '`' + cbResult[key] + '`';
    }
  }
  const target = getVForInTarget(`${attributes['v-for']}`);
  if (target) {
    const { item, index, symbol, list } = target;
    let vForIndexStr = index;
    if (!index) {
      attributes['v-for'] = `(${item},index) ${symbol} ${list}`;
      vForIndexStr = 'index';
    }
    for (const key in newCbResult) {
      if (Object.hasOwnProperty.call(newCbResult, key)) {
        newCbResult[key] =
          newCbResult[key].slice(0, -2) + '${' + vForIndexStr + '}`';
      }
    }
  }
  return newCbResult;
}

function parseTagAttribute(attributes) {
  let attrs = '';
  for (const key in attributes) {
    const attrValue = attributes[key];
    // value 不存在 或者为 true 都简写
    if (!attrValue || attrValue === true) {
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
    endOfLine: 'crlf',
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
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagname, attributes) {
        const cbResult = cb(tagname);
        // 传入标签上已有的attr和生成的attr
        // attributes会覆盖cbResult生成的attr 旧的attr会一直在
        const newCbResult = handleTemplateAttribute(cbResult, attributes);
        const attr = `${parseTagAttribute({ ...newCbResult, ...attributes })}`;
        htmlString += `<${tagname} ${attr}>`;
      },
      ontext(text) {
        htmlString += text;
      },
      onclosetag(tagname, isImplied) {
        // 自闭合标签
        if (isImplied) {
          // 前面在open的时候拼上了> 自闭合标签需要替换成/>
          htmlString = htmlString.slice(0, htmlString.lastIndexOf('>')) + '/>';
        } else {
          htmlString += `</${tagname}>`;
        }
      },
      // 注释直接拼接
      oncomment(comment) {
        htmlString += `<!--${comment}-->`;
      },
    },
    {
      lowerCaseTags: false,
      recognizeSelfClosing: true,
      lowerCaseAttributeNames: false,
      decodeEntities: false,
    }
  );
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
      `文件${sourceFilePath}在第${positon.line}行第${
        positon.column
      }列出错,${errors[0].toString()}`
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
