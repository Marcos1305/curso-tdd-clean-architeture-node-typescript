import { RequireFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

const makeSut = (): RequireFieldValidation => {
  return new RequireFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name ' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value ' })
    expect(error).toBeFalsy()
  })
})
