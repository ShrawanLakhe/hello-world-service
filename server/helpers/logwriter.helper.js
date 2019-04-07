'use strict';

const {
    logFormat
} = require('../configs/logger.config').log;

const {
    main,
    errorLogger,
    health
} = require('./custom-loggers-helper');

let metaObj = {
    meta: {
        metaKey: ''
    }
};

function log(data) {
    main.log(data);
}

function rpcRequest(requestId, type, payload) {

    metaObj.meta.metaKey = requestId;

    switch (logFormat) {
        case 'json':
            switch (type) {
                case 'main':
                    main.info(JSON.stringify(payload), metaObj);
                    break;

                case 'health':
                    health.info(JSON.stringify(payload), metaObj);
                    break;

                default:
                    main.info(JSON.stringify(payload), metaObj);
            }
            break;

        case 'sentence':
        default:
            const payloadString = (payload ? ` Response --> ${JSON.stringify(payload)}` : '');
            switch (type) {
                case 'main':
                    main.info(payloadString, metaObj);
                    break;

                case 'health':
                    health.info(payloadString, metaObj);
                    break;

                default:
                    main.info(payloadString, metaObj);
            }
    }
}

function WriteLogClass(level) {
    this.level = level;
    this.write = (requestId, message, details) => {
        const logData = {
            message
        };

        metaObj.meta.metaKey = requestId;

        if (details) {
            logData.details = details;
        }

        switch (logFormat) {
            case 'json':
                switch (level) {
                    case 'error':
                        errorLogger[this.level](JSON.stringify(logData), metaObj);
                        break;

                    default:
                        main[this.level](JSON.stringify(logData), metaObj);
                }
                break;

            case 'sentence':
            default:
                const detailsSentence = (logData.details ? ` -- details --> ${JSON.stringify(logData.details)}` : '');

                switch (level) {
                    case 'error':
                        errorLogger[this.level](`${logData.message}${detailsSentence}`, metaObj);
                        break;

                    default:
                        main[this.level](`${logData.message}${detailsSentence}`, metaObj);
                }
        }
    };
}

const loggers = {
    error: new WriteLogClass('error'),
    warn: new WriteLogClass('warn'),
    info: new WriteLogClass('info'),
    verbose: new WriteLogClass('verbose'),
    debug: new WriteLogClass('debug'),
    silly: new WriteLogClass('silly')
};

function logManager(requestId, body) {
    loggers[body.level].write(requestId, body.message, body.details);
}

function logReject(requestId, body) {
    if (body.error) {
        logManager(requestId, body.error);
    } else {
        const newBody = {
            error: {
                level: 'error',
                message: 'Exception',
                details: {
                    message: body.message,
                    stack: body.stack
                }
            }
        };

        logManager(requestId, newBody.error);
    }
}

exports.logger = {
    main,
    errorLogger,
    health,
    log,
    rpcRequest,
    error: loggers.error.write,
    warn: loggers.warn.write,
    info: loggers.info.write,
    verbose: loggers.verbose.write,
    debug: loggers.debug.write,
    silly: loggers.silly.write,
    log_reject: logReject,
    log_manager: logManager
};