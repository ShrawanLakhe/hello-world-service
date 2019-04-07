/**
 * Logger
 *
 * @module Logger
 */
'use strict';

const {
    createLogger,
    transports,
    format
} = require('winston');

const {
    combine,
    timestamp,
    label,
    printf
} = format;

const WinstonDailyRotateFile = require('winston-daily-rotate-file');

const config = require('../configs/logger.config');

const {
    logLevel,
    logPath,
    logFiles,
    logFormat
} = config.log;

const logFolder = 'logs';
const validLogLevels = [
    'error',
    'warn',
    'info',
    'verbose',
    'debug',
    'silly'
];

// loggers
const loggers = {};

/**
 * This is the function for generating the payload into desired logging format.
 *
 * @function logSyntax
 *
 * @param {Object} info - Payload for logging.
 * @param {string} info.timestamp - Time stamp.
 * @param {string} info.label - Filename.
 * @param {string} info.message - logging message.
 *
 * @returns {string} - Logging message modified into the desired format.
 */
const logSyntax = printf((info) => {
    switch (logFormat) {
        case 'json':
            return (info.meta && Object.keys(info.meta).length > 0) ? `{id: ${info.meta.metaKey}, timestamp: ${info.timestamp}, label: ${info.label}, level: ${info.level.toUpperCase()}, message: ${info.message}}`
                : `{timestamp: ${info.timestamp}, label: ${info.label}, level: ${info.level.toUpperCase()}, message: ${info.message}}`;

        case 'sentence':
        default:
            return (info.meta && Object.keys(info.meta).length > 0) ? `[${info.meta.metaKey}] - ${info.timestamp}-[${info.label}]-[${info.level.toUpperCase()}] - ${info.message}`
                : `${info.timestamp}-[${info.label}]-[${info.level.toUpperCase()}] - ${info.message}`;
    }
});

/**
 * This is the function for configuring the winston logger.
 *
 * @function initializeLoggers
 *
 * @param {string} type - Type of the log that may be main or health.
 *
 * @return {Promise}
 */
function initializeLoggers(type) {
    return new Promise((resolve) => {
        const logTransports = [
            new transports.Console()
        ];

        if (logFiles === 'true' || logFiles === true) {
            logTransports.push(
                new WinstonDailyRotateFile({
                    filename: `${type}-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    dirname: `${__dirname}/../../${logPath}/${logFolder}/${type.toLowerCase()}`
                })
            );
        }

        loggers[type] = createLogger({
            level: (validLogLevels.includes(logLevel) ? logLevel : 'silly'),
            transports: logTransports,
            format: combine(
                label({
                    label: process.env.SERVICE_NAME
                }),
                timestamp(),
                logSyntax
            )
        });

        resolve();
    });
}

async function initialize() {
    await initializeLoggers('main');
    await initializeLoggers('health');
}

/**
 * This is the function for getting the winston logger.
 *
 * @function getLogger
 *
 * @param {string} type - Type of the log
 *
 * @return {Object} - Logger instance
 */
function getLogger(type) {
    if (!loggers[type]) {
        initializeLoggers(type);
    }

    return loggers[type];
}

initialize();

module.exports = {
    main: getLogger('main'),
    errorLogger: getLogger('error'),
    health: getLogger('health')
};
