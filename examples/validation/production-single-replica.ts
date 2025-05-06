/**
 * Production Single Replica Validation Policy
 * 
 * This policy enforces that production services must have at least one replica configured
 */

import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (!isProduction) return;
  if (manifest.type !== 'service') return;
  if (!manifest.replicas || manifest.replicas < 1) {
    throw new ValidationError(
      'Production services must have at least one replica configured. See: https://docs.truefoundry.com/docs/update-rollback-promote-your-service'
    );
  }
} 