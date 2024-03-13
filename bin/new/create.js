const fs = require('fs-extra');
const path = require('path');
const Mustache = require('mustache');
const log = require('../utils/log');

const createModuleFiles = (moduleName, moduleType, moduleDesc) => {
  const outputName =
    moduleName[0].toLowerCase() + moduleName.slice(1, moduleName.length);
  const templates = [
    {
      template: 'moduleComponentTsx.tpl',
      output: `app/components/${moduleName}/${moduleName}.tsx`,
    },
    {
      template: 'moduleComponentStyle.tpl',
      output: `app/components/${moduleName}/${moduleName}.module.css`,
    },
  ];
  try {
    let tpl, output;
    templates.forEach((temp) => {
      tpl = fs.readFileSync(
        path.resolve(__dirname, `./templates/component/${temp.template}`),
        'utf8'
      );
      output = Mustache.render(tpl, { moduleName, outputName, moduleDesc });
      fs.outputFileSync(path.resolve(process.cwd(), temp.output), output);
    });
    log.success('模块文件创建完成');
  } catch (error) {
    log.error(error);
  }
};

module.exports = createModuleFiles;
