import { createServer } from 'http';
import express from 'express';
import { createReverseProxy } from './utils/proxy';

const api = express();

const server = createServer((req, res) => {
  !proxyRequest(req, res) && api(req, res)
})

const proxyRequest = createReverseProxy({ server }, {
  api: {
    enabled: true,
    match(req, { ws }) {
      if (!req.url?.startsWith('/dashboard')) {
        return true;
      }
      // if (ws) {
      //   if (!req.url?.startsWith('/dashboard/_next'))
      //     return true; // Matches non-NextJS websockets
      // } else {
      //   if (!req.url?.startsWith('/dashboard') && !req.url?.startsWith('/_next'))
      //     return true; // Matches API routes
      // }
    },
  },
  app: {
    enabled: true,
    server: {
      ws: true,
      target: {
        host: 'localhost',
        port: 3081,
      },
    },
    match(req) {
      return true;
    },
  }
})

server.listen(3080);

api.all('/', (req, res) => {
  res.redirect('/dashboard');
})

api.get('/ping', (req, res) => {
  res.send(`${new Date()}`)
})