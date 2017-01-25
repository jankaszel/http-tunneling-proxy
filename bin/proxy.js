#!/usr/bin/env node

/* eslint-disable no-console */
const {basename} = require('path');
const createProxyServer = require('../');
const parseOptions = require('argv-options');
const {version} = require('../package.json');

let args

try {
  const parsedArgs = parseOptions(process.argv.slice(2), {
    p: {
      alias: 'port',
      optional: true
    },

    h: {
      alias: 'host',
      optional: true
    }
  });

  args = Object.assign({
    port: 3030,
    host: '127.0.0.1'
  }, parsedArgs);
}
catch (err) {
  const cmd = basename(process.argv[1]);
  console.log(`Usage: ${cmd} [options]

Options:
  -p, --p [port]     Port number
  -h, --host [name]  Host name
  --help             Display usage

Version ${version}`);

  process.exit(1);
}

const proxyServer = createProxyServer(req => {
  console.log(`${req.method} ${req.url}`);
});

const {host, port} = args;
proxyServer.listen(port, host, err => {
  if (err) {
    console.error(`Error starting proxy to ${host}:${port}: ${err.message}`);
  } else {
    console.log(`Proxy listening on ${host}:${port}`);
  }
});
