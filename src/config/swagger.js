const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartFood API',
      version: '1.0.0',
      description: 'API para gestión de alimentos con alertas de caducidad y sugerencias de recetas con IA',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Food: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string', example: 'Manzana' },
            quantity: { type: 'number', example: 5 },
            unit: { type: 'string', enum: ['kg', 'g', 'L', 'ml', 'piezas'], example: 'piezas' },
            category: {
              type: 'string',
              enum: ['frutas', 'verduras', 'lacteos', 'carnes', 'granos', 'enlatados', 'bebidas', 'otros'],
            },
            purchaseDate: { type: 'string', format: 'date', example: '2026-05-19' },
            expirationDate: { type: 'string', format: 'date', example: '2026-05-26' },
            status: { type: 'string', enum: ['bueno', 'por_caducar', 'caducado'] },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
