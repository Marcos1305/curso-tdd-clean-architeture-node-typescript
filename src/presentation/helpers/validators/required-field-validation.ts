import { Validation } from '../../protocols/validation'
import { MissingParamError } from '../../errors'

export class RequireFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
