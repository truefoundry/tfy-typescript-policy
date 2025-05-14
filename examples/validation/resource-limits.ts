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

  // if the environment is production return
  if (isProduction) return;

  // if the application is not a service or async-service return
  if (manifest.type !== 'service' && manifest.type !== 'async-service') return;

  // if the service has cpu limit greater than 32 throw an error
  if(manifest.resources?.cpu_limit && manifest.resources.cpu_limit > 32) {
    throw new ValidationError('non-production services cannot request more than 32 CPUs. See:https://docs.truefoundry.com/docs/resources');
  }
  
  // if the service has memory limit greater than 96 GB throw an error
  if(manifest.resources?.memory_limit && manifest.resources.memory_limit > 96000) {
    throw new ValidationError('non-production services cannot request more than 96GB RAM (96000MB). See: https://docs.truefoundry.com/docs/resources');
  }
} 