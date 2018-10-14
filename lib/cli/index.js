#!/usr/bin/env node

'use strict';

// https://www.npmjs.com/package/commander
const program = require('commander');
const chalk = require('chalk');
const packageInfo = require('../../package.json');
const create = require('../cmd/create');

program.version(packageInfo.version);

program
  .command('create <app-name>')
  .description('create a new project powered by l42-cli')
  .action((name, cmd) => {
    create(name, cmd);
  });

program
  .command('add')
  .description('add new templates')
  .alias('a') // 简写
  .action(() => {
    require('../cmd/add')();
  });

program
  .command('delete')
  .description('delete templates')
  .alias('d') // 简写
  .action(() => {
    require('../cmd/delete')();
  });

program
  .command('list')
  .description('list templates')
  .alias('l') // 简写
  .action(() => {
    require('../cmd/list')();
  });

program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
});

program.parse(process.argv);

// 没有用户输入时显示帮助;
if (!program.args.length) {
  program.outputHelp();
}
