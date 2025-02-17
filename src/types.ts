import { KubernetesObjectWithSpec } from "@kubernetes/client-node";
import { AsyncService, Job, Notebook, Service, SparkJob, SSHServer, Workflow, Workspace } from "./models";

export interface ValidationInput {
    manifest: ApplicationManifest;
    context: ValidationContext;
}
export interface ValidationContext {
    workspace: WorkspaceEntity;
}

export interface WorkspaceEntity {
    id: string;
    manifest: Workspace
    fqn: string
}

export type ApplicationManifest = Service | AsyncService | Workflow | Notebook | SSHServer | Workspace | Job | SparkJob;

export interface MutationInput {
    outputK8sManifests: KubernetesObjectWithSpec[];
    context: MutationContext;
}

export interface MutationContext {
    workspace: WorkspaceEntity;
    inputManifest: ApplicationManifest;
}


