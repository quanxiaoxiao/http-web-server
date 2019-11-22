const pick = require('./lib/pick');

module.exports = (ctx) => {
  const list = ctx
    .db
    .get('records')
    .filter({
      name: ctx.resourceName,
    })
    .value();
  return list.map(pick);
};
