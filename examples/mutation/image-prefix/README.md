# Image Prefix Mutation Policy

This policy modifies container image references to use a private registry prefix. It ensures all container images are pulled from a private registry by replacing public registry references with private ones.

## Purpose

Using a private registry for container images provides several benefits:
- Better security through access control
- Improved reliability with local caching
- Consistent image availability
- Reduced external dependencies

## Implementation

The policy modifies image references in:
1. Kubernetes Deployments and StatefulSets
2. Argo WorkflowTemplates
3. Flyte task containers

It replaces `tfy.jfrog.io` with `private.tfy.jfrog.io` while preserving the rest of the image reference.

## Usage

1. Copy the `policy.ts` file to your project
2. Configure the policy in your TFY configuration
3. Test with your manifests

## Example

```typescript
// The policy will replace public registry references with private ones
if (container.image.startsWith('tfy.jfrog.io')) {
  container.image = container.image.replace(
    'tfy.jfrog.io',
    'private.tfy.jfrog.io'
  );
}
```

## Testing

To test the policy:
1. Apply the policy to your manifests
2. Verify that image references are correctly modified
3. Check that the policy works with different resource types
4. Ensure existing private registry references are not modified