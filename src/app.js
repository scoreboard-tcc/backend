const cors = require('cors');
const express = require('express');

const errorHandler = require('./middlewares/errorHandler');
const { postRequestMiddleware } = require('./middlewares/transaction');
const router = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(errorHandler);
app.use(postRequestMiddleware);

module.exports = app;
