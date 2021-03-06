import {
  ValidationComposite,
  EmailValidation,
  RequireFieldValidation,
  CompareFieldsValidation
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../adapters/validators/email/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequireFieldValidation(field))
  }

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  const validationComposite = new ValidationComposite(validations)

  return validationComposite
}
