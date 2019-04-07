'use strict';

(() => {

    const { logger } = require(`${global.__serviceDir}/helpers/logwriter.helper`);
    const moduleConfig = require('../config')

    module.exports = async (call, callback) => {
        const { debug } = call.request;
        console.log('debug====================..............>>>>>>>>>>>>>>>>>>>...........', call, debug);
        const { debugId } = debug ? debug : "";//this check for null will be removed once the debugId generate interceptor is used in the service which will intercept each service call and creates the new debugId if not already passed on the service call
        try {
            logger.rpcRequest(debugId, 'main', {msg: moduleConfig.message.helloWorldMessage});
            return callback(null, {
                success: true,
                msg: moduleConfig.message.helloWorldMessage,
                debug: {
                    debugId: debugId
                }
            });
        } catch (err) {
            logger.log_reject(debugId, JSON.stringify(err));

            return callback(null, {
                error: true,
                msg: moduleConfig.message.serverError,
                debug: {
                    debugId: debugId
                }
            });
        }
    };

})();
