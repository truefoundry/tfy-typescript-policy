import { KubernetesObjectWithSpec } from "@kubernetes/client-node";
import { AsyncService, Job, Notebook, Service, SparkJob, SSHServer, Workflow, Workspace } from "./models";

export type Action = 'apply' | 'delete';

export interface ValidationInput {
    manifest: ApplicationManifest;
    context: ValidationContext;
}
export interface ValidationContext {
    workspace_name?: string;
    cluster_name?: string;
    env_name?: string;
    action: Action;
}

export type ApplicationManifest = Service | AsyncService | Workflow | Notebook | SSHServer | Workspace | Job | SparkJob;

export interface MutationInput {
    outputK8sManifests: KubernetesObjectWithSpec[];
    context: MutationContext;
}

export interface MutationContext {
  workspace_name?: string;
  cluster_name?: string;
  env_name?: string;
  action: Action;
  inputManifest: ApplicationManifest;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
