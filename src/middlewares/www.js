const { pathToRegexp } = require('path-to-regexp');
const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');

module.exports = (resourcePath, projects) => {
  if (!shelljs.test('-d', resourcePath)) {
    shelljs.mkdir('-p', resourcePath);
  }

  const pageList = Object
    .entries(projects)
    .map(([key, value]) => {
      const pageRegList = Object
        .keys(value.pages)
        .map((pathname) => ({
          regexp: pathToRegexp(pathname),
          fn: value.pages[pathname],
        }));

      return {
        name: key,
        list: pageRegList,
      };
    })
    .reduce((acc, cur) => [
      ...acc,
      ...cur.list.map((item) => ({
        name: cur.name,
        ...item,
      })),
    ], []);

  return async (ctx, next) => {
    ctx.resourcePath = resourcePath;
    const page = pageList.find((pageItem) => pageItem.regexp.exec(ctx.path));
    if (page) {
      const current = ctx.db.get(`current.${page.name}`).value();
      if (!current) {
        ctx.throw(404);
      }
      const filePathnme = page.fn(page.regexp.exec(ctx.path));
      const pathname = path.join(
        resourcePath,
        current,
        filePathnme,
      );
      if (pathname.indexOf(path.join(resourcePath, current)) !== 0) {
        ctx.trhow(400);
      }
      ctx.type = path.extname(pathname);
      ctx.body = fs.createReadStream(pathname);
    } else {
      await next();
    }
  };
};
