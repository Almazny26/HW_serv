require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const PORT = process.env.PORT || 3005;
const HOST = '127.0.0.1';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library';

const app = express();

// cors чтобы с localhost работало
app.use(cors({
  origin: (origin, cb) => {
    const allowed = !origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    cb(null, allowed);
  },
  optionsSuccessStatus: 200
}));
app.use(express.json());

// логирую урл каждого запроса
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.use('/users', usersRouter);
app.use('/books', booksRouter);

// роут не найден
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// если что-то упало - отдаём 500, сервер не падает
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(404).json({ error: 'Сущность не найдена' });
  }
  res.status(500).json({ error: 'Ошибка сервера при обработке запроса' });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB подключена');
    app.listen(PORT, HOST, () => {
      console.log(`REST API доступен по адресу http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  }
}

start();
