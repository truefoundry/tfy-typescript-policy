/**
 * Node Affinity Mutation Policy
 * 
 * This policy adds node affinity rules to ensure pods are scheduled on specific nodes.
 * It's useful for workload distribution and resource management in Kubernetes clusters.
 * 
 * For example:
 * - Adds node affinity to schedule pods on specific nodes
 * - Preserves any existing node affinity rules
 */

import { MutationInput, MutationOutput } from '@src/types';

/**
 * Node affinity configurations
 * Each configuration defines a node affinity rule to be applied
 */
const nodeAffinityConfigs = [
  {
    key: 'kubernetes.io/hostname',
    operator: 'In',
    values: ['node-1'],
  }
];

/**
 * Adds node affinity to a spec
 */
function addNodeAffinity(spec: any): void {
  // Create or update the affinity configuration
  spec.affinity = {
    ...(spec.affinity || {}),
    nodeAffinity: {
      ...(spec.affinity?.nodeAffinity || {}),
      requiredDuringSchedulingIgnoredDuringExecution: {
        nodeSelectorTerms: [
          ...(spec.affinity?.nodeAffinity?.requiredDuringSchedulingIgnoredDuringExecution?.nodeSelectorTerms || []),
          {
            matchExpressions: nodeAffinityConfigs,
          },
        ],
      },
    },
  };
}

/**
 * Processes a manifest and adds node affinity
 */
function processManifest(manifest: any): void {
  // Handle Deployment and StatefulSet resources
  if (manifest.kind && ['Deployment', 'StatefulSet'].includes(manifest.kind)) {
    if (manifest.spec?.template?.spec) {
      addNodeAffinity(manifest.spec.template.spec);
    }
  }
  // Handle WorkflowTemplate resources
  else if (manifest.kind === 'WorkflowTemplate' && manifest.spec?.templates) {
    for (const template of manifest.spec.templates) {
      if (template.affinity) {
        addNodeAffinity(template);
      }
    }
  }
}

export function mutate(mutationInput: MutationInput): MutationOutput {
  const { generatedK8sManifests, flyteTasks } = mutationInput;

  // Process Kubernetes manifests if present
  if (generatedK8sManifests) {
    for (const manifest of generatedK8sManifests) {
      processManifest(manifest);
    }
  }
  // Process Flyte tasks if present
  else if (flyteTasks) {
    for (const task of Object.values(flyteTasks)) {
      if (task?.template?.k8sPod?.podSpec) {
        addNodeAffinity(task.template.k8sPod.podSpec);
      }
    }
  }

  return { generatedK8sManifests, flyteTasks };
}
