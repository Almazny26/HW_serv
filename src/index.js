const http = require('http');
const { getUsers } = require('./modules/users');

// порт из переменной или 3003
const PORT = process.env.PORT || 3003;
const HOST = '127.0.0.1';

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${HOST}:${PORT}`);
  const searchParams = url.searchParams;

  // привет с именем
  if (searchParams.has('hello')) {
    let name = '';
    const rawQuery = (request.url.split('?')[1] || '').replace(/\+/g, ' ');
    for (const pair of rawQuery.split('&')) {
      const eq = pair.indexOf('=');
      const key = eq === -1 ? pair : pair.slice(0, eq);
      const value = eq === -1 ? '' : pair.slice(eq + 1);
      if (key === 'hello') {
        try {
          name = value ? decodeURIComponent(value) : '';
        } catch (_) {
          name = searchParams.get('hello') || '';
        }
        break;
      }
    }
    if (String(name).trim() === '') {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Enter a name');
      return;
    }
    const body = 'Hello, ' + name + '.';
    response.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': Buffer.byteLength(body, 'utf8')
    });
    response.end(Buffer.from(body, 'utf8'));
    return;
  }

  // список юзеров из файла
  if (searchParams.has('users')) {
    try {
      const users = getUsers();
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify(users));
    } catch (err) {
      response.writeHead(500);
      response.end();
    }
    return;
  }

  // без параметров
  if ([...searchParams.keys()].length === 0) {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Hello, World!');
    return;
  }

  // всё остальное - 500
  response.writeHead(500);
  response.end();
});

server.listen(PORT, HOST, () => {
  console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`);
});
