const swaggerAutogen = require("swagger-autogen")();

const outputFile = './swagger_output.json';
const endpointsFile = ['./index.jss'];

swaggerAutogen(outputFile, endpointsFile);