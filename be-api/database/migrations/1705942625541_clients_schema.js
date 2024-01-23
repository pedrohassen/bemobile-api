'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientsSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.string('name', 80).notNullable().unique()
      table.integer('cpf').notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientsSchema