const createModuleFiles = require('./create');
const rimraf = require('rimraf');
const inquirer = require('inquirer');

class NewModule {
  constructor() {
    this.createModule();
  }

  async createModule() {
    // 模块类型
    const moduleType = await this.inputType();
    // 模块名
    const moduleName = await this.inputName();
    // 模块描述
    const moduleDesc = await this.inputDesc();
    // 清除重名文件
    await this.clearFile(moduleName, moduleType);
    createModuleFiles(moduleName, moduleType, moduleDesc);
  }

  async inputType() {
    const { moduleType } = await inquirer.prompt([
      {
        name: 'moduleType',
        message: '请选择创建类型',
        type: 'list',
        choices: [
          {
            name: 'UI组件',
            value: 'component',
          },
          {
            name: '页面',
            value: 'page',
          },
        ],
        default: 'component',
      },
    ]);
    return moduleType;
  }
  async inputName() {
    const { moduleName } = await inquirer.prompt([
      {
        name: 'moduleName',
        message: '请输入模块名称',
        type: 'input',
      },
    ]);
    return moduleName;
  }
  async inputDesc() {
    const { moduleDesc } = await inquirer.prompt([
      {
        name: 'moduleDesc',
        message: '请输入模块描述',
        type: 'input',
      },
    ]);
    return moduleDesc;
  }

  async clearFile(moduleName, moduleType) {
    if (moduleType === 'page') {
      rimraf.rimraf(
        path.resolve(process.cwd(), 'app/component', `${moduleName}.module.css`)
      );
      rimraf.rimraf(
        path.resolve(process.cwd(), 'app/app', `${moduleName}.tsx`)
      );
    } else if (moduleType === 'component') {
    }
  }
}

new NewModule();
