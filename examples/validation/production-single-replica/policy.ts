import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (!isProduction) return;

  if (manifest.type !== 'service') return;

  const replicas = manifest.replicas || 1;
  
  // Check if service has only one replica
  if (replicas === 1) {
    if(manifest?.resources?.node?.type === 'node_selector' && manifest?.resources?.node.capacity_type !== 'on_demand') {
      throw new ValidationError('Service needs to be set to on-demand when there is only one replica');
    }
  }
} 