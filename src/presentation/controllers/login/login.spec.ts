import { LoginController } from './login'
import { MissingParamError } from '../../errors'
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '../../helpers/http-helper'
import { HttpRequest, Authentication } from './login-protocols'
import { Validation } from '../../helpers/validators/validation'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })

  test('Should returns 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(unauthorized())
  })

  test('Should returns 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should returns 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(
      ok({
        accessToken: 'any_token'
      })
    )
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should returns 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      return new MissingParamError('any_field')
    })

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
