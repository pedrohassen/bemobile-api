'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SalesSchema extends Schema {
  up () {
    this.create('sales', (table) => {
      table.increments()
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('cascade')
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('cascade')
      table.integer('quantity').notNullable()
      table.integer('unity_price').notNullable()
      table.integer('total_price').notNullable()
      table.date('date').notNullable()
      table.time('hour').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('sales')
  }
}

module.exports = SalesSchema