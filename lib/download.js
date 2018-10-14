const download = require('download-git-repo');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');

module.exports = function(name) {
  const tmpdir = path.join(os.tmpdir(), 'l42-cli', 'template');
  fs.remove(tmpdir);
  return new Promise((resolve, reject) => {
    download(name, tmpdir, { clone: true }, err => {
      if (err) {
        fs.remove(tmpdir);
        return reject(err);
      }
      resolve(tmpdir);
    });
  });
};
