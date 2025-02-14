import { Service, Workspace } from './src/models';
import { validate } from './src/policy';
import { ValidationContext } from './src/types';

const dummyWorkspace: Workspace = {
    type: 'workspace',
    cluster_fqn: 'test-cluster',
    name: 'test-workspace'
}

const dummyValidationContext: ValidationContext = {
    workspace: {
        id: '1',
        name: 'test-workspace',
        manifest: dummyWorkspace,
        fqn: 'test-workspace'
    }
}

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
    ]
};

try {
    const validatedService = validate(githubService, dummyValidationContext);
    console.log(validatedService);
} catch (error) {
    console.error(error);
}
