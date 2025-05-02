import { MutationInput, MutationOutput } from '@src/types';

export function mutate(mutationInput: MutationInput): MutationOutput {
  const { generatedK8sManifests, flyteTasks } = mutationInput;

  if (generatedK8sManifests) {
    for (const manifest of generatedK8sManifests) {
      if (
        manifest.kind &&
        ['Deployment', 'StatefulSet'].includes(manifest.kind) &&
        manifest.spec.template.spec
      ) {
        manifest.spec.template.spec.affinity = {
          ...(manifest.spec.template.spec.affinity || {}),
          nodeAffinity: {
            ...(manifest.spec.template.spec.affinity?.nodeAffinity || {}),
            requiredDuringSchedulingIgnoredDuringExecution: {
              nodeSelectorTerms: [
                ...(manifest.spec.template.spec.affinity?.nodeAffinity
                  ?.requiredDuringSchedulingIgnoredDuringExecution
                  ?.nodeSelectorTerms || []),
                {
                  matchExpressions: [
                    {
                      key: 'kubernetes.io/hostname',
                      operator: 'In',
                      values: ['node-1'],
                    },
                  ],
                },
              ],
            },
          },
        };
      } else if (
        manifest.kind === 'WorkflowTemplate' &&
        manifest.spec.templates
      ) {
        for (const template of manifest.spec.templates) {
          if (template.affinity) {
            template.affinity.nodeAffinity = {
              ...(template.affinity.nodeAffinity || {}),
              requiredDuringSchedulingIgnoredDuringExecution: {
                nodeSelectorTerms: [
                  ...(template.affinity.nodeAffinity
                    ?.requiredDuringSchedulingIgnoredDuringExecution
                    ?.nodeSelectorTerms || []),
                  {
                    matchExpressions: [
                      {
                        key: 'kubernetes.io/hostname',
                        operator: 'In',
                        values: ['node-1'],
                      },
                    ],
                  },
                ],
              },
            };
          }
        }
      }
    }

    return { generatedK8sManifests };
  } else if (flyteTasks) {
    for (const task of Object.values(flyteTasks)) {
      if (task.template.k8sPod.podSpec) {
        task.template.k8sPod.podSpec.affinity = {
          ...(task.template.k8sPod.podSpec.affinity || {}),
          nodeAffinity: {
            ...(task.template.k8sPod.podSpec.affinity?.nodeAffinity || {}),
            requiredDuringSchedulingIgnoredDuringExecution: {
              nodeSelectorTerms: [
                ...(task.template.k8sPod.podSpec.affinity?.nodeAffinity
                  ?.requiredDuringSchedulingIgnoredDuringExecution
                  ?.nodeSelectorTerms || []),
                {
                  matchExpressions: [
                    {
                      key: 'kubernetes.io/hostname',
                      operator: 'In',
                      values: ['node-1'],
                    },
                  ],
                },
              ],
            },
          },
        };
      }
    }

    return { flyteTasks };
  }

  return {};
}
