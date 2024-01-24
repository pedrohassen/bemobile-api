'use strict'

const Model = use('@adonisjs/lucid/src/Lucid/Model')

class Sale extends Model {
  client() {
    return this.belongsTo('App/Models/Client')
  }

  book() {
    return this.belongsTo('App/Models/Book')
  }
}

module.exports = Sale
