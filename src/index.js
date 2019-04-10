const express = require('express');
const PostgreSQL = require('./postgresql');

const app = express();
app.disable('x-powered-by');

app.get('/', (req, res, next) => {
  try {
    // TODO do stuff here
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

app.use('*', (req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { method, url, route } = req;
  const error = err.stack || err.toString();
  console.error(error);
  res.status(500).json({ method, url, route, error });
});

app.listen(5555, () => console.log('Listening on port 5555...'));
