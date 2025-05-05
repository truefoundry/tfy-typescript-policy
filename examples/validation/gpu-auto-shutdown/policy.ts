/**
 * GPU Auto-Shutdown Validation Policy
 * 
 * This policy enforces that non-production GPU deployments must have auto shutdown enabled.
 */

import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (isProduction) return;
  if (manifest.type !== 'service') return;
  if (manifest.resources?.devices?.[0].type == "nvidia_gpu") {
    if (!manifest.auto_shutdown) {
      throw new ValidationError(
        'Auto shutdown is required for GPU services.'
      );
    }
  }
} 