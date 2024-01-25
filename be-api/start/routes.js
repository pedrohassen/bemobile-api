'use strict'

const Route = use('@adonisjs/framework/src/Route/Manager')

Route.get('/', () => {
  return { greeting: 'Hello World: BeMobile - Desafio Backend' }
})

Route.post('user', 'AuthController.register')
Route.post('login', 'AuthController.authenticate')

Route.post('book', 'BooksController.store').middleware(['auth']);
Route.get('books', 'BooksController.index')
Route.get('book/:id', 'BooksController.show')
Route.put('book/:id', 'BooksController.update').middleware(['auth']);
Route.delete('book/:id', 'BooksController.destroy').middleware(['auth']);

Route.post('client', 'ClientsController.store').middleware(['auth']);
Route.get('clients', 'ClientsController.index').middleware(['auth']);
Route.get('client/:id', 'ClientsController.show').middleware(['auth']);
Route.put('client/:id', 'ClientsController.update').middleware(['auth']);
Route.get('client/detail/:id', 'ClientsController.detail').middleware(['auth']);
Route.delete('client/:id', 'ClientsController.destroy').middleware(['auth']);

Route.post('sale', 'SalesController.store').middleware(['auth']);
