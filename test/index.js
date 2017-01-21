/* eslint-env mocha */
const http = require('http');
const assert = require('assert');
const fetch = require('node-fetch');
const createProxyServer = require('../');
const HttpsProxyAgent = require('https-proxy-agent');

const fixturePath = 'foo';
const fixtureData = 'bar';
const httpPort = 3077;
const proxyPort = 3078;

const proxyAgent = new HttpsProxyAgent(`http://127.0.0.1:${proxyPort}`);

let httpServer, proxyServer, proxyCalled;

describe('createProxyServer()', () => {
  beforeEach(() => {
    proxyCalled = false;

    const httpPromise = new Promise(resolve => {
      httpServer = http.createServer((req, res) => {
        if (req.url === `/${fixturePath}`) {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          });

          res.write(fixtureData);
          res.end();
        } else {
          res.writeHead(404);
          res.end();
        }
      }).listen(httpPort, () => resolve());
    });

    const proxyPromise = new Promise(resolve => {
      proxyServer = createProxyServer(() => {
        proxyCalled = true;
      });

      proxyServer.listen(proxyPort, () => resolve());
    });

    return Promise.all([httpPromise, proxyPromise]);
  });

  afterEach(() => {
    proxyServer.close();
    httpServer.close();
  });

  it('should forward http requests', () => {
    return fetch(`http://127.0.0.1:${httpPort}/${fixturePath}`, {
      agent: proxyAgent
    }).then(res => {
      return res.text();
    }).then(data => {
      assert.equal(data, fixtureData, 'Received data does not match');
      assert.equal(proxyCalled, true, 'Proxy has not been called');
    });
  });
});
