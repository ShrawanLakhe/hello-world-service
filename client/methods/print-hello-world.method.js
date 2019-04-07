'use strict';

const grpcClient = require('../helpers/grpc-client.helper');
const client = grpcClient.init("0.0.0.0", 50051, "hello.proto", "HelloWorldRpc")

client.printHelloWorld({}, (err, response) => {
    if (err) {
        console.error('Error while logging in => ', err.stack);
    }

    console.log(">>>>>>>>>>>> response <<<<<<<<<<<<<<<<<", response);
});