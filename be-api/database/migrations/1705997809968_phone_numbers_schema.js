'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhoneNumbersSchema extends Schema {
  up () {
    this.create('phone_numbers', (table) => {
      table.increments()
      table.string('number', 20).notNullable()
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('phone_numbers')
  }
}

module.exports = PhoneNumbersSchema