const express = require('express');
const highest = require('./highest.js');

const app = express();

//landing page
app.get('/', (req, res) => {
  res.send('/league_id');
});

//request league page
app.get('/:id', async (req, res) => {
  req.setTimeout(0);
  res.header('Content-Type', 'application/json');
  try {
    const result = await highest(req.params.id);
    res.send(JSON.stringify(result, null, 4));
  } catch (err) {
    console.log(err);
    res.status(err.response.status).send(err.response.statusText);
  }
});

//capture the annoying favicon.ico request
app.get('/favicon.ico', (_, res) => res.status(204));

app.listen(process.env.PORT || 4000, () => {
  console.log('server is running on 4000');
});
