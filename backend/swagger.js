const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PizzaHub API',
      version: '1.0.0',
      description: 'PizzaHub REST API documentation',
      contact: {
        name: 'PizzaHub Support'
      },
      servers: ['http://localhost:5000']
    }
  },
  apis: ['./routes/*.js'] // Path to the API routes
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  specs,
}; 