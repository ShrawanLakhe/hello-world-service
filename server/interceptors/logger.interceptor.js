'use strict';

((loggerInterceptor) => {

    const { logger } = require('../helpers/logwriter.helper');

    loggerInterceptor.initiateLog = async (ctx, next) => {
        if(ctx.service) {
            let debugId = ctx.call.request.debug.debugId;
            let methodName = ctx.service.method;
            let payload = {
                level: 'info',
                message: `[${methodName}] - Initiating method call of ${process.env.SERVICE_NAME}`,
                details: {
                    service: ctx.call.metadata._internal_repr
                }
            };

            if (ctx.call && ctx.call.request && ctx.call.request.authorization && Object.keys(ctx.call.request.authorization).length > 0 && (ctx.call.request.authorization.ip !== '' || ctx.call.request.authorization.userAgent !== '')) {
                payload.details.client = {
                    ip: ctx.call.request.authorization.ip,
                    userAgent: ctx.call.request.authorization.userAgent
                }
            }

            logger.log_manager(debugId, payload);
        }
        return await next();
    };
})(module.exports);