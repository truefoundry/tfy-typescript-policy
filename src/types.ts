import {
  AsyncService,
  EnvironmentManifest,
  Helm,
  Job,
  Notebook,
  PolicyEntityTypes,
  Service,
  SSHServer,
  Workflow,
} from './models';

export declare class V1OwnerReference {
  'apiVersion': string;
  'blockOwnerDeletion'?: boolean;
  'controller'?: boolean;
  'kind': string;
  'name': string;
  'uid': string;
  static discriminator: string | undefined;
  static attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
  }>;
  static getAttributeTypeMap(): {
    name: string;
    baseName: string;
    type: string;
  }[];
}

export declare class V1ManagedFieldsEntry {
  'apiVersion'?: string;
  'fieldsType'?: string;
  'fieldsV1'?: object;
  'manager'?: string;
  'operation'?: string;
  'subresource'?: string;
  'time'?: Date;
  static discriminator: string | undefined;
  static attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
  }>;
  static getAttributeTypeMap(): {
    name: string;
    baseName: string;
    type: string;
  }[];
}

export declare class V1ObjectMeta {
  'annotations'?: {
    [key: string]: string;
  };
  'creationTimestamp'?: Date;
  'deletionGracePeriodSeconds'?: number;
  'deletionTimestamp'?: Date;
  'finalizers'?: Array<string>;
  'generateName'?: string;
  'generation'?: number;
  'labels'?: {
    [key: string]: string;
  };
  'managedFields'?: Array<V1ManagedFieldsEntry>;
  'name'?: string;
  'namespace'?: string;
  'ownerReferences'?: Array<V1OwnerReference>;
  'resourceVersion'?: string;
  'selfLink'?: string;
  'uid'?: string;
  static discriminator: string | undefined;
  static attributeTypeMap: Array<{
    name: string;
    baseName: string;
    type: string;
  }>;
  static getAttributeTypeMap(): {
    name: string;
    baseName: string;
    type: string;
  }[];
}

export interface KubernetesObject {
  apiVersion?: string;
  kind?: string;
  metadata?: V1ObjectMeta;
}
export interface KubernetesObjectWithSpec extends KubernetesObject {
  spec: Record<string, any>;
}

export enum SubjectType {
  user = 'user',
  team = 'team',
  serviceaccount = 'serviceaccount',
}
export interface Subject {
  subjectId: string;
  subjectType: SubjectType;
  subjectSlug?: string;
  subjectDisplayName?: string;
}

export interface ValidationInput {
  manifest: ApplicationManifest;
  flyteTasks?: Record<string, any>;
  context: ValidationContext;
}
export interface ValidationContext {
  entityType: PolicyEntityTypes;
  workspaceName: string;
  clusterName: string;
  environment?: {
    manifest: EnvironmentManifest;
  };
  createdByUser: Subject;
  activeDeployment?: {
    manifest: object;
  };
  lastDeployment?: {
    manifest: object;
  };
}

export type ApplicationManifest = Service | AsyncService | Job | Notebook | SSHServer | Workflow | Helm;

export interface MutationInput {
  generatedK8sManifests?: KubernetesObjectWithSpec[];
  flyteTasks?: Record<string, any>;
  context: MutationContext;
}

export class MutationOutput {
  generatedK8sManifests?: KubernetesObjectWithSpec[];
  flyteTasks?: Record<string, any>;
}

export interface MutationContext extends ValidationContext {
  inputManifest: ApplicationManifest;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
