'use strict'

const Model = use('@adonisjs/lucid/src/Lucid/Model')

class Book extends Model {
  sales() {
    return this.hasMany('App/Models/Sale')
  }
}

module.exports = Book
