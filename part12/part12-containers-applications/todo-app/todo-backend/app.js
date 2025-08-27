const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config()

const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use('/api', indexRouter);
app.use('/api/todos', todosRouter);

app.use('/assets', express.static(path.join(__dirname, '../todo-frontend/dist/assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../todo-frontend/dist/index.html'));
});

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../todo-frontend/dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

module.exports = app;