/**
 * GRPC Interceptor
 *
 * @module grpcInterceptor
 */

'use strict';

(() => {

    const debugIdInterceptor = require('./debug-id.interceptor');
    const loggerInterceptor = require('./logger.interceptor');

    module.exports = {
        generateDebugIdInterceptor: debugIdInterceptor.generateDebugId,
        loggerInterceptor: loggerInterceptor.initiateLog

    }

})();
