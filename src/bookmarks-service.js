const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks_table')
  },
  insertBookmarks(knex, newArticle) {
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
  deleteBookmarks(knex, id) {
    return knex('bookmarks_table')
      .where({ id })
      .delete()
  },
  updateBookmarks(knex, id, newBookmarksFields) {
    return knex('bookmarks_table')
      .where({ id })
      .update(newBookmarksFields)
  },
}

module.exports = BookmarksService