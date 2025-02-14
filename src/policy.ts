import { ValidationError } from './errors';
import { Service } from './models';
import { ValidationContext } from './types';

export function validate(service: Service, context: ValidationContext): Service {
    // Check if service has image property of type Build
    if ('image' in service && service.image && 'build_source' in service.image) {
        const buildSource = service.image.build_source;
        if (buildSource.type === 'git' && buildSource.repo_url.toLowerCase().includes('github.com')) {
            throw new ValidationError('GitHub repositories are not allowed as build sources');
        }
    }
    return service;
}