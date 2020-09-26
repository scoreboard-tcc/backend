const express = require('express');
const cors = require('cors');

const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { postRequestMiddleware } = require('./middlewares/transaction');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(errorHandler);
app.use(postRequestMiddleware);

module.exports = app;
