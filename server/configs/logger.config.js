'use strict';

(() => {

    module.exports = {
        log: {
            logLevel: process.env.LOG_LEVEL,
            logPath: process.env.LOG_PATH,
            logFiles: process.env.LOG_FILES || 'false',
            logFormat: process.env.LOG_FORMAT || 'sentence'
        }
    };

})();