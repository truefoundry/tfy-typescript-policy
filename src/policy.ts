import { ValidationInput, ValidationError } from './types';

export function validate(validationInput: ValidationInput): void {
    if (validationInput.manifest.type !== 'service') {
        return;
    }
    const service = validationInput.manifest;

    // Check if service has image property of type Build
    if ('image' in service && service.image && 'build_source' in service.image) {
        const buildSource = service.image.build_source;
        if (buildSource.type === 'git' && buildSource.repo_url.toLowerCase().includes('github.com')) {
            throw new ValidationError('GitHub repositories are not allowed as build sources');
        }
    }
}
