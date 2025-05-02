# TFY TypeScript Policy Examples

This directory contains example policies that demonstrate how to use the TrueFoundry Policy framework. These examples can be used as templates for creating your own policies.

## Directory Structure

```
examples/
├── validation/           # Validation policy examples
│   ├── auto-shutdown/    # Example for enforcing auto-shutdown in dev environments
├── mutation/            # Mutation policy examples
│   ├── image-prefix/    # Example for modifying container image prefixes
│   ├── node-affinity/   # Example for adding node affinity rules
└── README.md           # This file
```

## Types of Policies

### Validation Policies
Validation policies are used to enforce rules and constraints on your TrueFoundry manifests

### Mutation Policies
Mutation policies allow you to modify Kubernetes manifests before they are applied to the cluster

## How to Use These Examples

1. Choose the type of policy you want to implement (validation or mutation)
2. Browse the examples in the corresponding directory
3. Copy the example that best matches your use case
4. Modify the policy according to your requirements
5. Test the policy with your manifests