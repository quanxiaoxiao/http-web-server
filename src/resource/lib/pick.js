const fs = require('fs');

const _ = require('lodash');

module.exports = (d) => ({
  ..._.pick(d, ['_id', 'name', 'message', 'tag', 'timeCreate']),
  list: d.list.map((fileItem) => {
    const stats = fs.statSync(fileItem.pathname);
    return {
      pathname: fileItem.pathname.slice(d.basedir.length + 1),
      hash: fileItem.hash,
      size: stats.size,
    };
  }),
});
