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

  // if the environment is production return
  if (isProduction) return;

  // if the application is not a service return
  if (manifest.type !== 'service') return;

  const hasGpu = manifest.resources?.devices?.[0].type === "nvidia_gpu"

  // if the service does not have a GPU return
  if(!hasGpu) return;

  // if auto shutdown is not enabled throw an error
  if (!manifest.auto_shutdown) {
    throw new ValidationError(
      'Auto shutdown is required for non-production GPU services. See: https://docs.truefoundry.com/docs/scaling-and-autoscaling#auto-shutdown'
    );
  }
} 