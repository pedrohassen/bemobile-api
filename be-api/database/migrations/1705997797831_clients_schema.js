'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientsSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.string('name', 80).notNullable().unique()
      table.string('cpf').notNullable().unique()
      table.integer('address_id').unsigned().references('id').inTable('addresses').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientsSchema