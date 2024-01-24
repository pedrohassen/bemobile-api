'use strict'

const Route = use('@adonisjs/framework/src/Route/Manager')

Route.get('/', () => {
  return { greeting: 'Hello World: BeMobile - Desafio Backend' }
})

Route.post('user', 'AuthController.register')
Route.post('auth', 'AuthController.authenticate')

Route.post('book', 'BooksController.store')
Route.get('books', 'BooksController.index')
Route.get('book/:id', 'BooksController.show')
Route.put('book/:id', 'BooksController.update')
Route.delete('book/:id', 'BooksController.destroy')

Route.post('client', 'ClientsController.store')
Route.get('clients', 'ClientsController.index')
Route.get('client/:id', 'ClientsController.show')
Route.put('client/:id', 'ClientsController.update')
Route.get('client/detail/:id', 'ClientsController.detail')
Route.delete('client/:id', 'ClientsController.destroy')

Route.post('sale', 'SalesController.store')
