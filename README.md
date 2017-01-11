# `http-tunneling-proxy`

This is a simple, minimally modifiable HTTP tunneling proxy written in Node.js. It is based on a snippet available in the
[Node.js docs](https://nodejs.org/api/http.html#http_event_connect). The module 
exposes a single function and a CLI application for launching a local proxy. It
is available on [npm](https://www.npmjs.com/package/http-tunneling-proxy).

### CLI

`http-tunneling-proxy [--port p] [--host h]`

This command will spawn a local HTTP tunneling proxy, bound to the specified
port and hostname. Port defaults to `3030`, while host defaults to `127.0.0.1`.

### API 

`createProxyServer([callback])`

This method will return a fresh, unbound 
[`http.Server`](https://nodejs.org/api/http.html#http_class_http_server)
instance that can be bound via `listen()`. The callback function
will be called at each request:

```js
const proxyServer = createProxyServer(req => {
  console.log(`${req.method} ${req.url}`);
});
```
