'use strict'

const Model = use('@adonisjs/lucid/src/Lucid/Model')

class Client extends Model {
  address() {
    return this.belongsTo('App/Models/Address');
  }

  phoneNumber() {
    return this.hasOne('App/Models/PhoneNumber');
  }

  sales() {
    return this.hasMany('App/Models/Sale');
  }
}

module.exports = Client
