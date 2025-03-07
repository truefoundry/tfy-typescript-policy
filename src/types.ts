import { Job, PolicyActions, PolicyEntityTypes, Service } from './models';

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
  spec: object;
}

export interface ValidationInput {
  manifest: Manifest;
  context: ValidationContext;
}
export interface ValidationContext {
  entity: PolicyEntityTypes;
  action: PolicyActions;
  filters: Filters;
}

export type Manifest = Service | Job;

export interface MutationInput {
  outputK8sManifests: KubernetesObjectWithSpec[];
  context: MutationContext;
}

export interface MutationContext {
  entity: PolicyEntityTypes;
  action: PolicyActions;
  filters: Filters;
  inputManifest: Manifest;
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
