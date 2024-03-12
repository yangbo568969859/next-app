const fs = require('fs-extra');
const path = require('path');
const Mustache = require('mustache');

const createModuleFiles = (moduleName, moduleType, moduleDesc) => {
  console.log(moduleName);
  console.log(moduleType);
  const outputName =
    moduleName[0].toLowerCase() + moduleName.slice(1, moduleName.length);
  const templates = [
    {
      template: 'moduleComponentTsx.tpl',
      output: `app/components/${moduleName}.tsx`,
    },
    {
      template: 'moduleComponentStyle.tpl',
      output: `app/components/${moduleName}.module.css`,
    },
  ];
  try {
    let tpl, output;
    templates.forEach((temp) => {
      tpl = fs.readFileSync(
        path.resolve(__dirname, `../templates/component/${temp.template}`),
        'utf8'
      );
      output = Mustache.render(tpl, { moduleName, outputName });
      fs.outputFileSync(path.resolve(__dirname, temp.output), output);
    });
    console.log('模块文件创建完成');
  } catch (error) {
    console.error(error);
  }
};

module.exports = createModuleFiles;
