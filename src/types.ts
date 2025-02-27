import { KubernetesObjectWithSpec } from '@kubernetes/client-node';
import { Job, PolicyActions, PolicyEntityTypes, Service } from './models';

export interface ValidationInput {
  manifest: ApplicationManifest;
  context: ValidationContext;
}
export interface ValidationContext {
  entity: PolicyEntityTypes;
  action: PolicyActions;
  filters: Filters;
}

export type ApplicationManifest = Service | Job;

export interface MutationInput {
  outputK8sManifests: KubernetesObjectWithSpec[];
  context: MutationContext;
}

export interface MutationContext {
  entity: PolicyEntityTypes;
  action: PolicyActions;
  filters: Filters;
  inputManifest: ApplicationManifest;
}

export interface Filters {
  workspace_name?: string;
  cluster_name?: string;
  env_name?: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
