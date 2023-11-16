const swaggerAutogen = require("swagger-autogen")();

const outputFile = '../swagger_output.json';
const endpointsFile = ['./index.js'];

swaggerAutogen(outputFile, endpointsFile);