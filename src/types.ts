import { AsyncService, Job, Notebook, Service, SparkJob, SSHServer, Workflow, Workspace } from "./models";

export interface ValidationContext {
    workspace: WorkspaceEntity;
}

export interface WorkspaceEntity {
    id: string;
    name: string;
    manifest: Workspace
    fqn: string
}

export type ApplicationManifest = Service | AsyncService | Workflow | Notebook | SSHServer | Workspace | Job | SparkJob;

export interface MutationContext {
    workspace: WorkspaceEntity;
    inputManifest: ApplicationManifest;
}


