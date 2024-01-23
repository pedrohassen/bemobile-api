'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BooksSchema extends Schema {
  up () {
    this.create('books', (table) => {
      table.increments()
      table.string('title', 80).notNullable().unique()
      table.string('author', 80).notNullable()
      table.string('description', 250).notNullable()
      table.integer('price').notNullable()
      table.integer('stock').notNullable()
      table.integer('year').notNullable()
      table.integer('active').defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('books')
  }
}

module.exports = BooksSchema