const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shelljs = require('shelljs');

module.exports = (dbPathName, projests) => {
  if (!shelljs.test('-d', path.dirname(dbPathName))) {
    shelljs.mkdir('-p', path.dirname(dbPathName));
  }

  const adapter = new FileSync(dbPathName);

  const db = low(adapter);

  db
    .defaults({
      current: Object.keys(projests).reduce((acc, key) => ({
        ...acc,
        [key]: null,
      }), {}),
      records: [],
    })
    .write();
  return async (ctx, next) => {
    ctx.db = db;
    await next();
  };
};
