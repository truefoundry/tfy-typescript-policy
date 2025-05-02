import { ValidationInput, ValidationError } from '@src/types';

export function validate(validationInput: ValidationInput): void {
  const { manifest, context } = validationInput;
  const environment = context.environment;
  const isProduction = environment?.manifest.isProduction;

  if (!isProduction) return;
  if (manifest.type !== 'service') return;

  const imageType = manifest.image?.type;
  const buildSourceType = manifest.image?.build_source?.type;

  const isValidBuildType = imageType === 'build';
  const isValidImageType = imageType === 'image' && ['git', 'remote'].includes(buildSourceType);

  if (!isValidBuildType && !isValidImageType) {
    throw new ValidationError(
      'Production services must use either build type or image type with git/remote source'
    );
  }
} 