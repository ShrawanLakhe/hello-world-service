/**
 * GRPC Health Checker
 *
 * @module grpcHealthCheckHelper
 */
'use strict';

((grpcHealthCheckHelper) => {

    const protoHelper = require('./proto-loader.helper');
    const healthPb = require('../protos/build/health_pb');

    /**
     * This is the function for checking grpc services health.
     *
     * @function checkGrpcHealth
     * @param {Object} call - Request payload.
     * @param {Function} callback - Callback function that returns error or response.
     *
     * @return {Object} - Returns the status of the services.
     */
    const checkGrpcHealth = (call, callback) => {
        const healthCheckRequest = new healthPb.HealthCheckRequest();
        const healthCheckResponse = new healthPb.HealthCheckResponse();
        console.log('healthCheckResponse', healthCheckResponse, healthCheckResponse.ServingStatus, healthCheckResponse.getStatus());
        console.log('================================================================================================')

        const servingStatus = (healthCheckRequest.getService() == null) ? healthPb.HealthCheckResponse.ServingStatus.UNKNOWN : healthPb.HealthCheckResponse.ServingStatus.SERVING;
        return callback(null, { status : servingStatus });
    };

    /**
     * This is the initializing function of gprc health checker.
     *
     * @param {Function} grpc - GRPC instance
     * @param {Object} server - GRPC server instance.
     */
    grpcHealthCheckHelper.init = (grpc, server) => {
        const healthProto = protoHelper.init(grpc, 'health.proto');
        server.addService(healthProto.grpc.health.v1.Health.service, {
            Check : checkGrpcHealth
        });
    };

})(module.exports);

