const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "FoodieFiesta API",
      version: "1.0.0",
      description: "FoodieFiesta REST API documentation",
      contact: {
        name: "FoodieFiesta Support",
      },
      servers: ["http://localhost:5000"],
    },
  },
  apis: ["./routes/*.js"], 
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  specs,
};
