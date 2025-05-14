/**
 * Production Health Checks Validation Policy
 * 
 * This policy enforces that all production services must have both liveness and readiness probes configured
 */

import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  // if the environment is not production return
  if (!isProduction) return;

  // if the application is not a service or async service return
  if (manifest.type !== 'service' && manifest.type !== 'async-service') return;

  // if the service does not have both liveness and readiness probes throw an error
  if (!manifest.liveness_probe || !manifest.readiness_probe) {
    throw new ValidationError(
      'Liveness and Readiness probes are required for production services. See: https://docs.truefoundry.com/docs/liveness-readiness-probe'
    );
  }
} 