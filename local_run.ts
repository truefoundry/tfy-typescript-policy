import { Service } from './src/models';
import { validate } from './src/policy';
import { ValidationContext } from './src/types';

const dummyValidationContext: ValidationContext = {
  entityType: 'service',
  envName: 'dev',
  clusterName: 'cluster',
  workspaceName: 'workspace'
};

// Sample service with GitHub build source (should throw error)
const githubService: Service = {
    type: 'service',
    name: 'test-service',
    image: {
        type: 'build',
        build_spec: {
            type: 'dockerfile',
            dockerfile_path: 'Dockerfile',
            build_context_path: '.'
        },
        build_source: {
            type: 'git',
            repo_url: 'https://github.com/user/repo',
            ref: 'main',
        }
    },
    ports: [
        {
            port: 8080,
            protocol: 'TCP',
            expose: true
        }
    ],
    auto_shutdown: {
        wait_time: 300
    }
};

const validationInput = {
    manifest: githubService,
    context: dummyValidationContext
}

try {
    const validatedService = validate(validationInput); // will throw error that auto_shutdown wait_time should be less than 300 seconds for the dev environment
    console.log(validatedService);
} catch (error) {
    console.error(error);
}
