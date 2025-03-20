import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const envName = context.envName;

  if (manifest.type !== 'service') return;

  if (envName === 'prod') {
    if (!manifest.liveness_probe || !manifest.readiness_probe) {
      throw new ValidationError(
        'Liveness and Readiness probes are required for the prod environment.'
      );
    }
  } else if (envName === 'dev') {
    if (!manifest.auto_shutdown) {
      throw new ValidationError(
        'Auto shutdown is required for the dev environment.'
      );
    }
  }
}
