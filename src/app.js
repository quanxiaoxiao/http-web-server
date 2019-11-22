const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const cors = require('@koa/cors');
const httpServer = require('@quanxiaoxiao/http-server');
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
  ...other
}) => httpServer({
  middlewares: [
    loggerMiddleware(loggerPathName),
    cors(),
    etag(),
    conditional(),
    compress(),
    resourceDbMiddleware(resource.dbPathName, resource.projests),
    resourceAuthMiddleware({
      projectName: resource.projectName,
      projectKey: resource.projectKey,
      projests: resource.projests,
    }),
    wwwMiddleware(resource.resourcePath, resource.projests),
    ...middlewares,
  ],
  api: {
    ...resourceApi,
    ...api,
  },
  ...other,
});
