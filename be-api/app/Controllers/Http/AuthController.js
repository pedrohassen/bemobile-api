'use strict'

const User = use('App/Models/User')

class AuthController {
  async register ({ request, response }) {
    try {
      const data = request.only(['username', 'email', 'password'])

      const existingUser = await User.query()
      .where('email', data.email)
      .orWhere('username', data.username)
      .first()

      if (existingUser) {
        const existingField = existingUser.email === data.email ? 'email' : 'username'
        return response.status(409).send({
          message: `${existingField} is already in use. Please use a different ${existingField}.`
        })
      }
      const user = await User.create(data)
      return user
    } catch (error) {
      return response.status(400).send({
        message: 'Something went wrong'
      })
    }
  }

  async authenticate({ request, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    return token
  }
}

module.exports = AuthController
