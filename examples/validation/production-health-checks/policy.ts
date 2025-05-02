import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (!isProduction) return;
  if (!manifest.liveness_probe || !manifest.readiness_probe) {
    throw new ValidationError(
      'Liveness and Readiness probes are required for production services.'
    );
  }
} 