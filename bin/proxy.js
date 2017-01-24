#!/usr/bin/env node

/* eslint-disable no-console */
const {basename} = require('path');
const createProxyServer = require('../');
const {version} = require('../package.json');

let args = {
  port: 3030,
  host: '127.0.0.1'
};

try {
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '-p' || argv[i] === '--port') {
      const j = ++i;
      const port = parseInt(argv[j]);

      if (argv.length <= j || !Number.isInteger(port)) {
        throw new Error();
      } else {
        args.port = port;
      }
    } else if (argv[i] === 'h' || argv[i] === '--host') {
      const j = ++i;
      const host = argv[j];

      if (argv.length <= j) {
        throw new Error();
      } else {
        args.host = host;
      }
    } else {
      throw new Error();
    }
  }
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
