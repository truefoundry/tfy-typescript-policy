# Node Affinity Mutation Policy

This policy adds node affinity rules to ensure pods are scheduled on specific nodes. It's useful for workload distribution and resource management in Kubernetes clusters.

## Purpose

Node affinity rules help:
- Distribute workloads across specific nodes
- Ensure pods run on nodes with required resources
- Implement workload isolation
- Optimize resource utilization

## Implementation

The policy adds node affinity to:
1. Kubernetes Deployments and StatefulSets
2. Argo WorkflowTemplates
3. Flyte task pods

It adds a node selector term that ensures pods run on nodes with the hostname 'node-1', while preserving any existing affinity configurations.

## Usage

1. Copy the `policy.ts` file to your project
2. Configure the policy in your TFY configuration
3. Test with your manifests

## Example

```typescript
// The policy adds a node selector term to ensure pods run on specific nodes
nodeAffinity: {
  requiredDuringSchedulingIgnoredDuringExecution: {
    nodeSelectorTerms: [{
      matchExpressions: [{
        key: 'kubernetes.io/hostname',
        operator: 'In',
        values: ['node-1']
      }]
    }]
  }
}
```

## Testing

To test the policy:
1. Apply the policy to your manifests
2. Verify that node affinity is correctly added
3. Check that the policy works with different resource types
4. Ensure existing affinity configurations are preserved
5. Verify that the node selector terms are correctly structured 