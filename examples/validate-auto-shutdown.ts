import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const envName = context.environment.manifest.name;

  if (manifest.type !== 'service') return;

  if (envName === 'dev') {
    if (!manifest.auto_shutdown) {
      throw new ValidationError(
        'Auto shutdown is required for the dev environment.'
      );
    }
  }
}
