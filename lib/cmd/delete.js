const inquirer = require('inquirer');
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

const templates = require('../../templates');
const logger = require('../logger');
const table = require('../table');

async function deleteTemplate() {
  if (Object.keys(templates).length === 0) {
    table(templates);
    return;
  }
  const { name } = await inquirer.prompt([
    {
      name: 'name',
      type: 'list',
      message: ` That\'s all of templates. Pick one to delete:`,
      choices: Object.entries(templates).map(v => ({
        name: `${v[0]} ${v[1].desc}`,
        value: v[0]
      }))
    }
  ]);
  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `Are you really want to delete ${chalk.cyan(name)}`
    }
  ]);
  if (ok) {
    const newTemplates = templates;
    delete newTemplates[name];
    // 把模板信息写入templates.json
    await fs.writeJson(path.resolve(__dirname, '../../templates.json'), newTemplates);
    logger.done('Delete new template success.\n');
    table(newTemplates);
  }
}

module.exports = (...args) => {
  return deleteTemplate(...args).catch(err => {
    logger.error(`${err}`);
  });
};
