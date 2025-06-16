/**
 * Production Single-Replica Validation Policy
 * 
 * This policy enforces that services in production with one replica must use on-demand capacity type.
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

  const replicas = manifest.replicas;

  // if the service has more than one replica return
  if(replicas !== 1) return;

  // if the service has one replica and the capacity type is not on-demand throw an error
  if(manifest?.resources?.node?.type === 'node_selector' && manifest?.resources?.node.capacity_type !== 'on_demand') {
    throw new ValidationError('production services needs to be set to on-demand when there is only one replica. See: https://docs.truefoundry.com/docs/resources#choosing-between-spot-and-on-demand-instances');
  }
} 