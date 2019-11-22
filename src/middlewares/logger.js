const DailyRotateFile = require('winston-daily-rotate-file');
const winston = require('winston');
const path = require('path');


module.exports = (loggerPathName, match) => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.simple(),
    ),
    transports: [
      new DailyRotateFile({
        filename: path.resolve(loggerPathName),
      }),
    ],
  });
  return async (ctx, next) => {
    const { method, originalUrl } = ctx;
    ctx.logger = logger;
    if (match && match(originalUrl)) {
      await next();
      return;
    }
    logger.info(`<-- ${method} ${originalUrl} user-agent: ${ctx.get('user-agent')}`);
    try {
      await next();
    } catch (error) {
      logger.error(`${method} ${originalUrl} ${error.message}`);
      throw error;
    }
    const { res } = ctx;
    const onfinish = done.bind(null, 'finish'); // eslint-disable-line
    const onclose = done.bind(null, 'close'); // eslint-disable-line

    function done(event) {
      res.removeListener('finish', onfinish);
      res.removeListener('close', onclose);
      logger.info(`${event === 'close' ? '-x-' : '-->'} ${method} ${originalUrl} statusCode: ${ctx.status}`);
    }

    res.once('finish', onfinish);
    res.once('close', onclose);
  };
};
