require('dotenv').config()
const express = require('express')
const { isWebUri } = require('valid-url')
const xss = require('xss')
const uuid = require("uuid/v4");
const logger = require("../logger");
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const {bookmarks} = require('../bookmarks')
const BookmarksService = require('../bookmarks-service')

const serializeBookmarks = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: xss(bookmark.url),
  description: xss(bookmark.description),
  rating: article.rating,
})

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmarks))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send({
        error: { message: `'rating' must be a number between 0 and 5` }
      })
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send({
        error: { message: `'url' must be a valid URL` }
      })
    }

    const newBookmark = { title, url, description, rating }

  if (!title) {
    logger.error(`Title is required`);
    return res.status(400).json({
      error: { message: 'Missing title in request body' }});
  }

  if (!url) {
    logger.error(`Url is required`);
    return res.status(400).json({
      error: { message: 'Missing url in request body' }});
  }
  const id = uuid();

  const bookmark = {
    id,
    title, 
    url
  }

  bookmarks.push(bookmark)

  logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);

  BookmarksService.insertBookmarks(
    req.app.get('db'),
    newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(bookmark)
      })
      .catch(next)
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .all((req, res, next) => {
    BookmarksService.getById(
      req.app.get('db'),
      req.params.id
    )
    .then(bookmark => {
      if(!bookmark) {
        return res.status(404).json({
          error: { message: 'Bookmark does not exist' }
        })
      }
      res.bookmark = bookmark
      next()
    })
    .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeBookmarks(res.bookmark))
  })

  .delete((req, res, next) => {
    BookmarksService.deleteBookmarks(
      req.app.get('db'),
      req.params.id
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
  })

module.exports = bookmarkRouter