const http = require('http');
const https = require('https');
const Koa = require('koa');
const router = require('@quanxiaoxiao/router');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const cors = require('@koa/cors');
const resourceDbMiddleware = require('./middlewares/resourceDb');
const resourceAuthMiddleware = require('./middlewares/resourceAuth');
const wwwMiddleware = require('./middlewares/www');
const loggerMiddleware = require('./middlewares/logger');
const resourceApi = require('./resource');

module.exports = ({
  middlewares = [],
  api,
  loggerPathName,
  resource,
  port = 3000,
  key: certKey,
  cert,
}) => {
  const app = new Koa();
  [
    loggerMiddleware(loggerPathName),
    cors(),
    etag(),
    conditional(),
    compress(),
    resourceDbMiddleware(resource.dbPathName, resource.projects),
    resourceAuthMiddleware({
      projectName: resource.projectName,
      projectKey: resource.projectKey,
      projects: resource.projects,
      resourcePath: resource.resourcePath,
    }),
    wwwMiddleware(resource.resourcePath, resource.projects),
    ...middlewares,
  ].forEach((middleware) => {
    app.use(middleware);
  });

  app.use(router({
    ...resourceApi,
    ...api,
  }, true));

  const server = (cert ? https : http)
    .createServer({
      ...cert
        ? {
          cert,
          key: certKey,
        }
        : {},
    }, app.callback())
    .listen(port, () => {
      console.log(`server listen at port: ${port}`);
    });
  return server;
};
