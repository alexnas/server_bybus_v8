require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('./src/config/db.config');
const router = require('./src/routes/index');
const errorHandler = require('./src/middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enabling CORS for some specific origins only.
let corsOptions = {
  origin: ['http://localhost:5173', 'localhost:5173', 'http://localhost:5174', 'localhost:5174'],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api', router);

// Error handling
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // await sequelize.sync({ alter: true });
    app.listen(PORT, console.log('Server started on port ', PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
