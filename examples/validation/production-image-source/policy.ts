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

  if (!isProduction) return;
  if (manifest.type !== 'service') return;

  const imageType = manifest.image?.type;
  if (imageType === 'build' && !['git', 'remote'].includes(manifest.image?.build_source?.type)) {
    throw new ValidationError(
      'Production services must use either image or build with git/remote source'
    );
  }
} 