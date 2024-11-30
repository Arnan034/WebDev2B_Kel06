const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

// Buat folder logs jika belum ada
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Fungsi untuk membuat transport
const createDailyRotateFile = (filename, level = 'info') => {
    const logPath = `logs/${filename.split('/')[0]}`;
    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
    }

    return new winston.transports.DailyRotateFile({
        filename: `logs/${filename}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: level,
        maxFiles: '7d',
        zippedArchive: true
    });
};

// Logger untuk semua request
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        createDailyRotateFile('users/error', 'error'),
        createDailyRotateFile('users/combined')
    ]
});

// Create different loggers
const cmsLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        createDailyRotateFile('cms/error', 'error'),
        createDailyRotateFile('cms/combined')
    ]
});

// Logger untuk request auth
const authLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        createDailyRotateFile('auth/error', 'error'),
        createDailyRotateFile('auth/combined')
    ]
});

const requestAuthLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        createDailyRotateFile('auth/request')
    ]
});

const queryLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        createDailyRotateFile('query/error', 'error'),
        createDailyRotateFile('query/combined')
    ]
});

// Development logging
if (process.env.NODE_ENV !== 'production') {
    const consoleFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    );
    
    [cmsLogger, logger, authLogger].forEach(logger => {
        logger.add(new winston.transports.Console({ format: consoleFormat }));
    });
}

module.exports = {
    logger,
    cmsLogger,
    authLogger,
    requestAuthLogger,
    queryLogger
};