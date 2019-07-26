const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks_table')
  },
  insertBookmark(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('bookmarks_table')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('bookmarks_table').select('*').where('id', id).first()
  },
  deleteBookmark(knex, id) {
    return knex('bookmarks_table')
      .where({ id })
      .delete()
  },
  updateBookmark(knex, id, newBookmarksFields) {
    return knex('bookmarks_table')
      .where({ id })
      .update(newBookmarksFields)
  },
}

module.exports = BookmarksService