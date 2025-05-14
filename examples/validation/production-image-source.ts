/**
 * Production Image Source Validation Policy
 * 
 * This policy enforces that production deployments must use either build type or image type with git/remote source.
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

  // if the image type is build and the build source local or remote throw an error
  const imageType = manifest.image?.type;
  if (imageType === 'build' && !['git'].includes(manifest.image?.build_source?.type)) {
    throw new ValidationError(
      'Production services must use either image or build with git source'
    );
  }
} 