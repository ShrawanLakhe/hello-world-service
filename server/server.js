'use strict';

const path = require('path');

global.__serviceDir = __dirname;
console.log('global.__serviceDir', global.__serviceDir);

require('dotenv').config({path: path.join(__dirname, "conf/.env")});
const grpc = require('grpc');

const { logger } = require('./helpers/logwriter.helper');
const protoHelper = require('./helpers/proto-loader.helper');
const { generateDebugIdInterceptor, loggerInterceptor } = require('./interceptors');
const helloWorldCtrl = require('./services/modules/hello-world-service');
const grpcHealthCheckHelper = require('./helpers/grpc-health-check.helper');
let server = new grpc.Server();

const proto = protoHelper.init(grpc, 'hello.proto');
logger.info('INITIALIZE', `Initializing ${process.env.SERVICE_NAME}`);
server.addService(proto.grpc.hello.v1.HelloWorldRpc.service, {
    printHelloWorld : helloWorldCtrl.printHelloWorld
});

grpcHealthCheckHelper.init(grpc, server);

server.bind(`0.0.0.0:${process.env.PORT}`,
    grpc.ServerCredentials.createInsecure());

server.start();

if (server.started) {
    console.log('Server running at 0.0.0.0:' + process.env.PORT);
    // server.use(generateDebugIdInterceptor);
    // server.use(loggerInterceptor);

    logger.info('INITIALIZE', `${process.env.SERVICE_NAME} is initialized and bind to ${process.env.PORT}`);
} else {
    return logger.error('INITIALIZE', `Failed to initialize ${process.env.SERVICE_NAME}`, server);
}
