#!/usr/bin/env node

import express from 'express';
import './compile.mjs';
import { handler } from '../dist/index.mjs';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const output = await handler({
    Records: [{ cf: { request: { querystring: new URLSearchParams(req.query).toString() } } }]
  });
  res.send(output.body);
})

app.use(express.static('public'));
app.use(express.static('node_modules/@picocss/pico'));

app.listen(port, () => {
  console.log(`Dev app listening at http://localhost:${port}`);
})
