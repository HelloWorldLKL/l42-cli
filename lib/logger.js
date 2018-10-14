const chalk = require('chalk');
const padStart = require('string.prototype.padstart');

const format = (label, msg) => {
  return msg
    .split('\n')
    .map((line, i) => {
      return i === 0 ? `${label} ${line}` : padStart(line, chalk.reset(label).length);
    })
    .join('\n');
};

module.exports = {
  log: msg => console.log(msg || ''),
  done: msg => console.log(format(chalk.bgGreen.black(' DONE '), msg)),
  error: msg => console.log(format(chalk.bgRed(' ERROR '), chalk.red(msg))),
  info: msg => console.log(format(chalk.bgBlue.black(' INFO '), msg)),
  warn: msg => console.log(format(chalk.bgYellow.black(' WARN '), chalk.yellow(msg)))
};
