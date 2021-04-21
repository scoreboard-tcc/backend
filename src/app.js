const cors = require('cors');
const express = require('express');

const errorHandler = require('./middlewares/errorHandler');
const router = require('./web/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(errorHandler);

module.exports = app;
