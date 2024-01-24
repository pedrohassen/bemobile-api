'use strict'

const Model = use('@adonisjs/lucid/src/Lucid/Model')

class PhoneNumber extends Model {
  client() {
    return this.belongsTo('App/Models/Client')
  }
}

module.exports = PhoneNumber
