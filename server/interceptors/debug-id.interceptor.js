/**
 * GRPC Interceptor
 *
 * @module grpcInterceptor
 */

'use strict';

((debugIdInterceptor) => {

    const uuidv4 = require('uuid/v4');

    debugIdInterceptor.generateDebugId = async (ctx, next) => {
        if(ctx.service) {
            if (ctx.call.request.debug === null) {
                ctx.call.request.debug = {
                    debugId: uuidv4()
                };
            }
            if (!ctx.call.request.debug.debugId || ctx.call.request.debug.debugId === '') {
                ctx.call.request.debug.debugId = uuidv4();
            }
        }
        return await next();
    };

})(module.exports);

