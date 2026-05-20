require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const sequelize = require('./src/config/database');

// Import models to register associations
require('./src/models/User');
require('./src/models/Food');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/foods', require('./src/routes/food'));
app.use('/api/recipes', require('./src/routes/recipes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('Database connected and synchronized');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
