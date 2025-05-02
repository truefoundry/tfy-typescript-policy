import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (manifest.type !== 'service') return;

  if (isProduction) {
    if (!manifest.liveness_probe || !manifest.readiness_probe) {
      throw new ValidationError(
        'Liveness and Readiness probes are required for the prod environment.'
      );
    }
  } else {
    if (!manifest.auto_shutdown) {
      throw new ValidationError(
        'Auto shutdown is required for the dev environment.'
      );
    }
  }
}
