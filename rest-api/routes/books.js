const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// все книги
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// создать
router.post('/', async (req, res, next) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// одна по id
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// обновить
router.put('/:id', async (req, res, next) => {
  try {
    const { title, author, year } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, year },
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// удалить
router.delete('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
