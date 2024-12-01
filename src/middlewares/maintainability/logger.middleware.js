const { requestAuthLogger } = require('../../utils/maintainability/logger.utils');

const createRequestLogger = (logger, area) => (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${area} request processed`, {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });

    next();
};

const authRequestLogger = createRequestLogger(requestAuthLogger, 'Auth');

module.exports = {
    authRequestLogger
};