/**
 * Image Prefix Mutation Policy
 * 
 * This policy modifies container image references to use a private registry.
 * It ensures all container images are pulled from a private registry by replacing
 * public registry references with private ones.
 * 
 * Image pull secrets can be added  to pull from the private registry.
 * 
 * For example:
 * - Input:  docker.io/library/nginx:latest
 * - Output: tfy.jfrog.io/library/nginx:latest
 */

import { MutationInput, MutationOutput } from '@src/types';

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

        // Replace the registry prefix for main containers
        if (containers) {
          for (const container of containers) {
            const destinationImageDetails = replaceRegistryPrefix(container.image);
            if (destinationImageDetails) {
              container.image = destinationImageDetails.destinationImageURI;
              if (destinationImageDetails.imagePullSecretName) {
                // gather all the secrets to add
                secretsToAdd.add(destinationImageDetails.imagePullSecretName);
              }
            }
          }
        }

        // Replace the registry prefix for init containers
        if (initContainers) {
          for (const container of initContainers) {
            const destinationImageDetails = replaceRegistryPrefix(container.image);
            if (destinationImageDetails) {
              container.image = destinationImageDetails.destinationImageURI;
              if (destinationImageDetails.imagePullSecretName) {
                // gather all the secrets to add
                secretsToAdd.add(destinationImageDetails.imagePullSecretName);
              }
            }
          }
        }

        // Add image pull secrets to the manifest
        if (secretsToAdd.size > 0) {
          manifest.spec.template.spec.imagePullSecrets = Array.from(secretsToAdd).map(name => ({
            name,
          }));
        }
      }
      // Handle WorkflowTemplate resources
      else if (manifest.kind === 'WorkflowTemplate' && manifest.spec?.templates) {
        // Replace the registry prefix for all containers in the workflow
        for (const template of manifest.spec.templates) {
          if (template.container?.image) {
            const destinationImageDetails = replaceRegistryPrefix(template.container.image);
            if (destinationImageDetails) {
              template.container.image = destinationImageDetails.destinationImageURI;
              if (destinationImageDetails.imagePullSecretName) {
                // gather all the secrets to add
                secretsToAdd.add(destinationImageDetails.imagePullSecretName);
              }
            }
          }
        }

        // Add image pull secrets to the manifest
        if (secretsToAdd.size > 0) {
          manifest.spec.imagePullSecrets = Array.from(secretsToAdd).map(name => ({
            name,
          }));
        }
      }
    }
  }
  // Process Flyte tasks if present
  else if (flyteTasks) {
    for (const task of Object.values(flyteTasks)) {
      const containers = task?.template?.k8sPod?.podSpec?.containers;
      // Replace the registry prefix for all containers in the flyte task
      if (containers) {
        for (const container of containers) {
          const destinationImageDetails = replaceRegistryPrefix(container.image);
          if (destinationImageDetails) {
            container.image = destinationImageDetails.destinationImageURI;
            if (destinationImageDetails.imagePullSecretName) {
              // gather all the secrets to add
              secretsToAdd.add(destinationImageDetails.imagePullSecretName);
            }
          }
        }
      }

      // Add image pull secrets to the task
      if (secretsToAdd.size > 0) {
        task.template.k8sPod.podSpec.imagePullSecrets = Array.from(secretsToAdd).map(name => ({
          name,
        }));
      }
    }
  }

  return { generatedK8sManifests, flyteTasks };
}
