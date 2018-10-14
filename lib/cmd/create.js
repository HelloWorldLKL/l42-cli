const fs = require('fs-extra');
const path = require('path');
const logger = require('../logger');
const chalk = require('chalk');
const inquirer = require('inquirer');

const download = require('../download');
const templates = require('../../templates');
const { logWithSpinner, stopSpinner } = require('../spinner');

async function create(projectName) {
  const inCurrent = projectName === '.';
  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, projectName || '.');
  if (fs.existsSync(targetDir)) {
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`
        }
      ]);
      if (!ok) {
        return;
      }
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [{ name: 'Overwrite', value: 'overwrite' }, { name: 'Merge', value: 'merge' }, { name: 'Cancel', value: false }]
        }
      ]);
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fs.remove(targetDir);
      }
    }
  }
  const { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: ` That\'s all of templates. Pick one to create your project:`,
      choices: Object.entries(templates).map(v => ({
        name: `${v[0]} ${v[1].desc}`,
        value: v[1]
      }))
    }
  ]);
  // 开始创建
  logWithSpinner(`✨`, `Creating project in ${chalk.yellow(targetDir)}.`);
  const GIT_REPO = `${template.gitRepoURL}#${template.branch}`;
  const tempPath = await download(`direct:${GIT_REPO}`);
  await fs.move(tempPath, targetDir);
  stopSpinner();
  logger.log();
  logger.log(`🎉  Successfully created project ${chalk.yellow(projectName)}.`);
  logger.log(`👉  Get started with the following commands:\n\n` + (inCurrent ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${projectName}\n`)) + chalk.cyan(` ${chalk.gray('$')} ${'yarn install'}`));
  logger.log();
}
module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false);
    logger.error(`${err}`);
  });
};
