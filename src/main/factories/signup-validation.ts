import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequireFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequireFieldValidation(field))
  }

  const validationComposite = new ValidationComposite(validations)

  return validationComposite
}
