const fse = require('fs-extra');

const createOrUpdateFile = async (filePath, content) => {
  return await fse.outputFile(filePath, content, 'utf8');
};

const getFileContent = async (filePath) => {
  return new Promise((res, rej) => {
    fse.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      res(data);
    });
  });
};

module.exports = { createOrUpdateFile, getFileContent };
