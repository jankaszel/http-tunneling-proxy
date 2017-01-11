#!/usr/bin/env node
const createProxyServer = require('../');
const {argv} = require('optimist');

const proxyServer = createProxyServer(req => {
  console.log(`${req.method} ${req.url}`);
});

const port = argv.port || 3030,
  host = argv.host || '127.0.0.1';

proxyServer.listen(port, host, err => {
  if (err) {
    console.error(`Error starting proxy to ${host}:${port}: ${err.message}`);
  } else {
    console.log(`Proxy listening on ${host}:${port}`);
  }
});
