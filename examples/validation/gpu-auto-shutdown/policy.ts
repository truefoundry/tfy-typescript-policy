import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (isProduction) return;
  if (manifest.resources?.devices?.[0].type == "nvidia_gpu") {
    if (!manifest.auto_shutdown) {
      throw new ValidationError(
        'Auto shutdown is required for GPU services.'
      );
    }
  }
} 