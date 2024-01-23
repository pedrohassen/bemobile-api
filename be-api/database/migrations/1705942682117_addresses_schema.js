'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressesSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.string('address', 250).notNullable()
      table.integer('number').notNullable()
      table.string('complement', 250).notNullable()
      table.string('city').notNullable()
      table.string('neighborhood').notNullable()
      table.string('state').notNullable()
      table.string('country').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressesSchema