<h1 align="center">Bem vindo a BeMobile - API 👋</h1>
<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

# Table of Contents
* [Project Overview](#Project-Overview)
* [Prerequisites](#Prerequisites)
* [Installation](#Installation)
* [Routes](#Routes)
* [support](#support)
* [License](#License)

---

## Project-Overview

Este repositório contém um projeto que me foi dado pela BeMobile como um teste para uma oportunidade de trabalho. Em resumo, eu deveria criar uma API com algumas especificações que me foram passadas.</br>
Para este projeto, eu usei Node js com Adonis js e Javascrip para o backend, além de MySQL com Lucid para o banco de dados.</br>

---

## Prerequisites

Para o projeto rodar na sua máquina, você vai precisar ter instalado:
- npm ou outro pacote similar - Eu recomendo a versão 10.2.3
- Node.js - Eu recomento a versão 18.19.0 'Hydrogen' (LTS)

---

## Installation

Primeiro de tudo, clone este repositório usando a opção SSH com o comando:
```sh
git clone git@github.com:pedrohassen/bemobile-api.git
```

Entre na pasta 'be-api' com o comando:

```sh
cd be-api/
```

Instale todas as dependências:

```sh
npm i
```

Rode o docker-compose para instalar o MySQL com as configurações necessárias:

```sh
docker-compose up
```

Modifique o arquivo .env.example para que ele se torne .env e mude as variáveis de ambiente de acordo com a necessidade,
Após isso, abra por exemplo, o MySQL Workbench e crie manualmente a table 'adonis':

```sh
CREATE DATABASE IF NOT EXISTS adonis;
```

Inicie o server com:

```sh
npm start ou node server.js
```

Faça as migrations necessárias com:

```sh
adonis migrations:run
```

E após isso é só começar a utilizar as rotas conforme necessidade.

---

## Routes

## GET

```sh
http://localhost:3333/
```

Olá Mundo! BeMobile API - Desafio Backend. Rota inicial de introdução, criada manualmente.

Output:
```sh
{"greeting":"Hello World: BeMobile - Desafio Backend"}
```

## POST

```sh
http://localhost:3333/user
```

Esta rota possibilita o registro de um usuário no banco de dados.

Input:
```sh
{
  "username": "User",
  "email": "user@email.com",
  "password": "1234"
}
```

Output:
```sh
{
  "username": "User",
  "email": "user@email.com",
  "password": "$2a$10$Mhs5sn1eeFzDKs6DAJ8FCu6xDmCa1lMLqipgXtwAAoiUqvBj4BYci",
  "created_at": "2024-01-26 00:08:55",
  "updated_at": "2024-01-26 00:08:55",
  "id": 1
}
```
Como pode ver, o password é registrado encriptado.

## POST

```sh
http://localhost:3333/login
```

Esta rota realiza o login do usuário após a sua criação.

Input:
```sh
{
  "email": "user@email.com",
  "password": "1234"
}
```

Output:
```sh
{
  "type": "bearer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTcwNjIzODY3OX0.kvRJoph0Jiyja8itPRhRNwFkrVxYfj10CxjW3ZI7rXM",
  "refreshToken": null
}
```
É gerado um token, que deve ser utilizado para validar o login do usuário cadastrado. Ele deve ser inserido no campo 'Auth', sub-seção 'Bearer'. Ou usado de forma lógica pelo frontend, afim de validar o usuário que faz o login de forma correta.

## POST

```sh
http://localhost:3333/book
```

Esta rota cadastra um livro no banco de dados. Para que funcione, é necessário o login de um usuário com token validado.

Input:
```sh
{
  "title": "Livro Exemplo",
  "author": "Autor Exemplo",
  "description": "A jornada exemplar",
  "price": 55,
  "stock": 50,
  "year": 2024
}
```

Output:
```sh
{
  "title": "Livro Exemplo",
  "author": "Autor Exemplo",
  "description": "A jornada exemplar",
  "price": 55,
  "stock": 50,
  "year": 2024,
  "created_at": "2024-01-26 00:17:28",
  "updated_at": "2024-01-26 00:17:28",
  "id": 1
}
```

## GET

```sh
http://localhost:3333/books
```

Esta rota busca todos os livros cadastrados no banco de dados e os mostra em um array.

## GET

```sh
http://localhost:3333/book/:id
```

Esta rota busca um livro específico, o encontrando pelo ID ao qual foi registrado.

## PUT

```sh
http://localhost:3333/book/:id
```

Esta rota atualiza as informações do livro, é necessário que o output seja semelhante ao da rota que registra os livros. É necessário o login de um usuário com token validado.

## DELETE

```sh
http://localhost:3333/book/:id
```

Esta rota deleta um livro, sem realmente o deletar do banco de dados. Na criação do livro, existe um atributo chamado 'active' que é por padrão setado para ser 1. Quando esta rota é usada, este atributo é mudado para 0, significando que não está mais disponível para a venda. Mas sem deletar as informações do bando de dados, caso no futuro ele volte à venda. É necessário o login de um usuário com token validado.

## POST

```sh
http://localhost:3333/client
```

Esta rota cadastra um cliente no banco de dados. É necessário o login de um usuário com token validado.

Input:
```sh
{
  "name": "Cliente",
  "cpf": "55555555555",
  "address": "Rua das Palmeiras",
  "number": 5555,
  "complement": "Esquina Rua Principal",
  "city": "Cidade do Cliente",
  "neighborhood": "Centro",
  "state": "RS",
  "country": "Brasil",
  "phoneNumber": "55555555"
}
```

Output:
```sh
{
  "message": "Client created successfully",
  "client": {
    "id": 1,
    "name": "Cliente",
    "cpf": "55555555555",
    "address": "Rua das Palmeiras",
    "number": 5555,
    "complement": "Esquina Rua Principal",
    "city": "Cidade do Cliente",
    "neighborhood": "Centro",
    "state": "RS",
    "country": "Brasil",
    "phoneNumber": "55555555"
  }
}
```

## GET

```sh
http://localhost:3333/clients
```

Esta rota busca todos os clientes já cadastrados no banco de dados. É necessário o login de um usuário com token validado.

## GET

```sh
http://localhost:3333/client/:id
```

Esta rota busca um cliente específico pelo seu ID gerado na hora do cadastro. É necessário o login de um usuário com token validado.

## PUT

```sh
http://localhost:3333/client/:id
```

Esta rota atualiza as informações de um cliente buscado pelo ID, menos o cpf, que é imutável. É necessário um input semelhante ao da rota de cadastro de clientes. É necessário o login de um usuário com token validado.

## DELETE

```sh
http://localhost:3333/client/:id
```

Esta rota deleta um cliente buscado pelo ID. É necessário o login de um usuário com token validado.

## POST

```sh
http://localhost:3333/sale
```

Esta rota cadastra a venda de um livro a um cliente específico. É preciso definir o ID do cliente, o ID do livro, a quantidade de livros, a data e a hora da venda. É necessário o login de um usuário com token validado.

Input:
```sh
{
  "client_id": 1,
  "book_id": 1,
  "quantity": 2,
  "date": "2020-01-01",
  "hour": "14:30"
}
```

Output:
```sh
{
  "message": "Sale registered successfully",
  "sale": {
    "client_id": 1,
    "book_id": 1,
    "quantity": 2,
    "unity_price": 55,
    "total_price": 110,
    "date": "2020-01-01",
    "hour": "14:30",
    "created_at": "2024-01-26 00:37:28",
    "updated_at": "2024-01-26 00:37:28",
    "id": 1
  }
}
```

É importante salientar que, a partir de agora, quando usada a rota que busca um cliente por ID, no registro do cliente, ficarão todas as vendas a ele associadas.

---

## Author

👤 **Pedro Hasse Niemczewski**

* Github: [@pedrohassen](https://github.com/pedrohassen)
* Linkedin: [Pedro Hasse Niemczewski](https://www.linkedin.com/in/pedrohassen/)

## support

Dê uma ⭐️ se este projeto te ajudou!

***