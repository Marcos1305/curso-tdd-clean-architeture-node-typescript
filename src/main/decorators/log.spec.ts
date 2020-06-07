import { LogControllerDecorator } from './log'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = {
          statusCode: 200,
          body: {
            ok: true
          }
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controlerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controlerStub)
    const handleSpy = jest.spyOn(controlerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
