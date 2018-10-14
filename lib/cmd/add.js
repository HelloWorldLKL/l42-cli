const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const templates = require('../../templates');
const logger = require('../logger');
const table = require('../table');

async function add() {
  const { name, gitRepoURL, branch, desc } = await inquirer.prompt([
    {
      name: 'name',
      message: `Template name`,
      validate: function(input) {
        if (!input) {
          return 'Template name is required.';
        } else if (templates[input]) {
          // 防止重复添加模版
          return 'This template name is already occupied.';
        } else {
          return true;
        }
      }
    },
    {
      name: 'gitRepoURL',
      message: `Git repository URL`
    },
    {
      name: 'branch',
      message: `Branch`,
      default: 'master'
    },
    {
      name: 'desc',
      message: `Description`
    }
  ]);
  const newTemplates = {
    ...templates,
    [name]: {
      gitRepoURL,
      branch,
      desc
    }
  };
  // 把模板信息写入templates.json
  await fs.writeJson(path.resolve(__dirname, '../../templates.json'), newTemplates);
  logger.done('Add new template success.\n');
  table(newTemplates);
}

module.exports = (...args) => {
  return add(...args).catch(err => {
    logger.error(`${err}`);
  });
};