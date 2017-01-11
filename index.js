// simple, uninspired http tunneling server, adapted from
// <https://nodejs.org/api/http.html#http_event_connect>
const url = require('url')
const net = require('net');
const http = require('http');

function createProxyServer(callback = () => {}) {
  const proxyServer = http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });

    res.end('OK');
  });

  proxyServer.on('connect', (req, cltSocket, head) => {
    callback(req);

    const {
      port,
      hostname
    } = url.parse(`http://${req.url}`);

    var srvSocket = net.connect(port, hostname, () => {
      cltSocket.write(
        'HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: Node.js-Proxy\r\n' +
        '\r\n'
      );

      srvSocket.write(head);
      srvSocket.pipe(cltSocket);
      cltSocket.pipe(srvSocket);

      srvSocket.on('error', err => {
        console.error(`Remote connection error: ${err.message}`);
      });
    });
  });

  return proxyServer;
}

module.exports = createProxyServer;
