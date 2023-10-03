const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Chrome RecordingSession API",
      version: "1.0.0",
      description: "API for recording Chrome sessions and streaming video data",
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
