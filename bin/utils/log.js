const logSymbols = require('log-symbols')
const chalk = require('chalk')

const log = {
  error: (msg) => {
    console.log(logSymbols.error, chalk.red(msg))
  },
  warn: (msg) => {
    console.log(logSymbols.warn, chalk.yellow(msg))
  },
  info: (msg) => {
    console.log(logSymbols.info, chalk.cyan(msg))
  },
  success: (msg) => {
    console.log(logSymbols.success, chalk.green(msg))
  }
}

module.exports = log