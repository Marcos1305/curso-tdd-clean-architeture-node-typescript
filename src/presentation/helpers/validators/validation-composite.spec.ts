import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

const makeValidation = (): ValidationStub => {
  return new ValidationStub()
}
interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('Should return Error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({
      field: 'any_value'
    })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({
      field: 'any_value'
    })

    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({
      field: 'any_value'
    })

    expect(error).toBeFalsy()
  })
})
