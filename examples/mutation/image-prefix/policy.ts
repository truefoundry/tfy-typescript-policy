/**
 * Image Prefix Mutation Policy
 * 
 * This policy modifies container image references to use a private registry prefix. It ensures all container images are pulled from a private registry by replacing public registry references with private ones.
 */

import { MutationInput, MutationOutput } from '@src/types';

export function mutate(mutationInput: MutationInput): MutationOutput {
  const { generatedK8sManifests, flyteTasks } = mutationInput;

  if (generatedK8sManifests) {
    for (const manifest of generatedK8sManifests) {
      if (
        manifest.kind &&
        ['Deployment', 'StatefulSet'].includes(manifest.kind)
      ) {
        manifest.spec.template.spec.containers.forEach((container: any) => {
          if (container.image.startsWith('tfy.jfrog.io')) {
            container.image = container.image.replace(
              'tfy.jfrog.io',
              'private.tfy.jfrog.io'
            );
          }
        });
      } else if (
        manifest.kind === 'WorkflowTemplate' &&
        manifest.spec?.templates
      ) {
        for (const template of manifest.spec.templates) {
          if (template.container?.image.startsWith('tfy.jfrog.io')) {
            template.container.image = template.container.image.replace(
              'tfy.jfrog.io',
              'private.tfy.jfrog.io'
            );
          }
        }
      }
    }
  } else if (flyteTasks) {
    for (const task of Object.values(flyteTasks)) {
      if (task.template?.k8sPod?.podSpec?.containers) {
        task.template.k8sPod.podSpec.containers.forEach((container: any) => {
          if (container.image.startsWith('tfy.jfrog.io')) {
            container.image = container.image.replace(
              'tfy.jfrog.io',
              'private.tfy.jfrog.io'
            );
          }
        });
      }
    }
  }

  return { generatedK8sManifests, flyteTasks };
}
