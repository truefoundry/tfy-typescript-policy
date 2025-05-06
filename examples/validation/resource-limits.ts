/**
 * Resource Limits Validation Policy
 * 
 * This policy enforces that non-production services cannot request more than 32 CPUs and 96GB RAM (96000MB).
 */

import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (isProduction) return;
  if (manifest.type !== 'service') return;
  if(manifest.resources?.cpu_limit && manifest.resources.cpu_limit > 32) {
    throw new ValidationError('Service cannot request more than 32 CPUs');
  }
  if(manifest.resources?.memory_limit && manifest.resources.memory_limit > 96000) {
    throw new ValidationError('Service cannot request more than 96GB RAM (96000MB)');
  }
} 