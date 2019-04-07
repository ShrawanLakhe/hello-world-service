/**
 * Proto Loader Helper
 *
 * @module grpcConnectHelper
 */
'use strict';

((grpcConnectHelper) => {

    const protoLoader = require('@grpc/proto-loader');
    const path = require('path');
    const PROTO_PATH = path.join(__dirname, '../', 'protos');

    /**
     * This is the function to load proto in the grpc instance.
     *
     * @namespace
     * @param {Object} grpc - GRPC instance.
     * @param {string} filename - Name of the proto file.
     *
     * @return {Object} - Response after loading the proto.
     * @exports grpcConnectHelper
     * @name grpcConnectorInit
     */
    grpcConnectHelper.init = (grpc, filename) => {
        const packageDefinition = protoLoader.loadSync(`${PROTO_PATH}/${filename}`, {
            keepCase: true,
            longs: String,
            defaults: true,
            oneofs: true,
        });
        return grpc.loadPackageDefinition(packageDefinition);
    };

})(module.exports);