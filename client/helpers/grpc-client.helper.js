/**
 * GRPC client connector
 *
 * @module Connector
 */
'use strict';

((connector) => {

    const grpc = require('grpc');
    const path = require('path');
    require('dotenv').config({path: path.join(__dirname, "../../server/", "conf/.env")});
    const protoLoader = require('@grpc/proto-loader');

    /**
     * This is the function for initializing grpc client.
     *
     * @namespace
     * @param {number} port - PORT of the service.
     * @param {string} filename - PROTO file name that should be loaded.
     * @param {string} rpcService - Name of the RPC service in the filename.
     *
     * @return {Object} - Instance of the GRPC client that was configured.
     * @exports Connector
     * @name init
     */

    connector.init = (host, port, filename, rpcService) => {
        const PROTO_PATH = require('path').join(__dirname, '../../server/protos/', filename);
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            defaults: true,
            oneofs: true
        });
        const proto = grpc.loadPackageDefinition(packageDefinition);
        const protoRpc = (proto.grpc && proto.grpc.health && proto.grpc.health.v1) ? proto.grpc.health.v1[rpcService] : proto.grpc.hello.v1[rpcService];
        const client = new protoRpc(`${host}:${port}`,
            grpc.credentials.createInsecure());
        return client;
    };

})(module.exports);