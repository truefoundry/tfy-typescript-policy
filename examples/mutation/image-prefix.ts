/**
 * Image Prefix Mutation Policy
 * 
 * This policy modifies container image references to use a private registry.
 * It ensures all container images are pulled from a private registry by replacing
 * public registry references with private ones.
 * 
 * Image pull secrets can be added to pull from the private registry.
 * 
 * For example:
 * - Input:  docker.io/library/nginx:latest
 * - Output: tfy.jfrog.io/library/nginx:latest
 */

import { MutationInput, MutationOutput } from '../../src/types';

/**
 * Registry mapping configuration
 * 
 * Defines how to map from public registries to private registries.
 * Each mapping contains:
 * - source_registry_prefix: the prefix of the public registry to match against
 * - destination_registry_prefix: the prefix of the private registry to replace with
 * - image_pull_secret_name: Optional secret name for pulling from private registry
 */
const registryMappings = [
  {
    source_registry_prefix: 'https://docker.io',
    destination_registry_prefix: 'https://tfy.jfrog.io',
    image_pull_secret_name: 'jfrog-image-pull-secret',
  },
];

// Type definition for the destination image details
type DestinationImageDetails = {
  destinationImageURI: string;
  imagePullSecretName?: string;
};

// Replaces the source registry with destination registry in the image URI
function replaceRegistryPrefix(sourceImageURI: string): DestinationImageDetails | undefined {
  // Find matching registry mapping
  const mapping = registryMappings.find(m => 
    sourceImageURI.startsWith(m.source_registry_prefix)
  );

  if (!mapping) {
    return undefined;
  }

  // Replace the registry prefix while keeping the rest of the URI intact
  const destinationImageURI = sourceImageURI.replace(
    mapping.source_registry_prefix,
    mapping.destination_registry_prefix
  );

  return {
    destinationImageURI,
    imagePullSecretName: mapping.image_pull_secret_name
  };
}

/**
 * Mutates container images and collects required secrets
 * Handles both regular containers and workflow template containers
 */
function mutateContainerImages(containers: any[] | undefined, secretsToAdd: Set<string>): void {
  if (!containers) return;

  for (const container of containers) {
    // Skip if no image to process
    if (!container?.image) continue;

    const destinationImageDetails = replaceRegistryPrefix(container.image);
    if (destinationImageDetails) {
      container.image = destinationImageDetails.destinationImageURI;
      if (destinationImageDetails.imagePullSecretName) {
        secretsToAdd.add(destinationImageDetails.imagePullSecretName);
      }
    }
  }
}

/**
 * Applies image pull secrets to a spec
 */
function applySecrets(spec: any, secretsToAdd: Set<string>): void {
  if (secretsToAdd.size > 0) {
    spec.imagePullSecrets = Array.from(secretsToAdd).map(name => ({ name }));
  }
}

export function mutate(mutationInput: MutationInput): MutationOutput {
  const { generatedK8sManifests, flyteTasks } = mutationInput;
  const secretsToAdd = new Set<string>();

  // Process Kubernetes manifests if present
  if (generatedK8sManifests) {
    for (const manifest of generatedK8sManifests) {
      // Handle Deployment and StatefulSet resources
      if (manifest.kind && ['Deployment', 'StatefulSet'].includes(manifest.kind)) {
        const containers = manifest.spec?.template?.spec?.containers;
        const initContainers = manifest.spec?.template?.spec?.initContainers;

        // Process all containers
        mutateContainerImages(containers, secretsToAdd);
        mutateContainerImages(initContainers, secretsToAdd);

        // Add image pull secrets to the manifest
        if (manifest.spec?.template?.spec) {
          applySecrets(manifest.spec.template.spec, secretsToAdd);
        }
      }
      // Handle WorkflowTemplate resources
      else if (manifest.kind === 'WorkflowTemplate' && manifest.spec?.templates) {
        // Process all containers in the workflow
        const containers = manifest.spec.templates.map(template => template.container);
        mutateContainerImages(containers, secretsToAdd);

        // Add image pull secrets to the manifest
        if (manifest.spec) {
          applySecrets(manifest.spec, secretsToAdd);
        }
      }
    }
  }
  // Process Flyte tasks if present
  else if (flyteTasks) {
    for (const task of Object.values(flyteTasks)) {
      const containers = task?.template?.k8sPod?.podSpec?.containers;
      
      // Process all containers in the flyte task
      mutateContainerImages(containers, secretsToAdd);

      // Add image pull secrets to the task
      if (task?.template?.k8sPod?.podSpec) {
        applySecrets(task.template.k8sPod.podSpec, secretsToAdd);
      }
    }
  }

  return { generatedK8sManifests, flyteTasks };
}
