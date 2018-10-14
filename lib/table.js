const Table = require('cli-table');

const logger = require('./logger');

const table = new Table({
  head: ['name', 'description'],
  style: {
    head: ['cyan']
  }
});

module.exports = config => {
  const keys = Object.keys(config);

  if (keys.length) {
    keys.forEach(key => {
      table.push([`${key}`, config[key].desc]);
    });
    const list = table.toString();
    if (list) {
      logger.info('That\'s all of templates:');
      console.log(`${list}\n`);
    } else {
      logger.warn('There is no template. You can run "l42 a" to add one.');
    }
  } else {
    logger.warn('There is no template. You can run "l42 a" to add one.');
  }
};
