import { ValidationInput, ValidationError } from './types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const envName = context.envName;

  if(manifest.type !== 'service') return;

  if (envName === 'prod') {
    if (!manifest.liveness_probe || !manifest.readiness_probe) {
      throw new ValidationError(
        'Liveness and Readiness probes are required for the prod environment.'
      );
    }

    const replicas = manifest.replicas;
    if (!replicas) {
      throw new ValidationError(
        'Replicas are required for the prod environment.'
      );
    }

    const minReplicas =
      typeof replicas === 'number' ? replicas : replicas.min_replicas;
    const maxReplicas =
      typeof replicas === 'number' ? replicas : replicas.max_replicas;

    if (minReplicas < 2 || maxReplicas > 10) {
      throw new ValidationError(
        'Replicas should be between 2 and 10 for the prod environment.'
      );
    }
  } else if (envName === 'dev') {
    if (!manifest.auto_shutdown) {
      throw new ValidationError(
        'Auto shutdown is required for the dev environment.'
      );
    }

    if (manifest.auto_shutdown.wait_time >= 300) {
      throw new ValidationError(
        'Auto shutdown wait time should be less than 300 seconds for the dev environment.'
      );
    }
  }
}

