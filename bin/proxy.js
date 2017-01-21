#!/usr/bin/env node

/* eslint-disable no-console */
const createProxyServer = require('../');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2), {
  string: 'lang',
  boolean: 'pager',
  alias: {
    p: 'port',
    h: 'host'
  },
  default: { lang: 'en' },
  '--': true
});

const proxyServer = createProxyServer(req => {
  console.log(`${req.method} ${req.url}`);
});

const port = args.port || 3030,
  host = args.host || '127.0.0.1';

proxyServer.listen(port, host, err => {
  if (err) {
    console.error(`Error starting proxy to ${host}:${port}: ${err.message}`);
  } else {
    console.log(`Proxy listening on ${host}:${port}`);
  }
});
