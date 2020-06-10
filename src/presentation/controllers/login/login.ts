import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Authentication
} from './login-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import {
  badRequest,
  serverError,
  unauthorized
} from '../../helpers/http-helper'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const requiredField = ['email', 'password']

      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}