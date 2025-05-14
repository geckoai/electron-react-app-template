import type { MetadataName, MetadataTag } from '@inversifyjs/core';
import type { LazyServiceIdentifier, Newable, ServiceIdentifier } from 'inversify';
import { ClassDecorate } from '@geckoai/class-mirror';

import type {
  ClassProvider,
  ConstantValueProvider,
  ConstructorProvider,
  DynamicValueProvider,
  ExistingProvider,
  ResolvedValueProvider
} from './factorys';

export type Provider =
  ConstantValueProvider<any>
  | DynamicValueProvider<any>
  | ResolvedValueProvider<any, any>
  | ClassProvider<any>
  | ConstructorProvider<any>
  | ExistingProvider<any>
  | Newable<any, any[]>;

export interface GeckoModuleIml {
  imports: Newable[],
  providers: Provider[],
  exports: Provider[],
}

export class GeckoModuleDecorate<T extends GeckoModuleIml | null = GeckoModuleIml> extends ClassDecorate<Partial<T>> {
}

export type ResolvedValueMetadataInjectOptions<T> = [T] extends [
    (infer U)[] | undefined
] ? [T] extends [U[]] ? MultipleResolvedValueMetadataInjectOptions<U> : MultipleOptionalResolvedValueMetadataInjectOptions<U> : T extends undefined ? OptionalResolvedValueMetadataInjectOptions<T> : BaseResolvedValueMetadataInjectOptions<T>;

interface BaseResolvedValueMetadataInjectOptions<T> {
  name?: MetadataName;
  serviceIdentifier: ServiceIdentifier<T> | LazyServiceIdentifier<T>;
  tags?: ResolvedValueMetadataInjectTagOptions[];
}

interface BaseMultipleResolvedValueMetadataInjectOptions {
  isMultiple?: true;
}

interface BaseOptionalResolvedValueMetadataInjectOptions {
  optional: true;
}

export interface MultipleResolvedValueMetadataInjectOptions<T> extends BaseResolvedValueMetadataInjectOptions<T>, BaseMultipleResolvedValueMetadataInjectOptions {
}

interface MultipleOptionalResolvedValueMetadataInjectOptions<T> extends BaseResolvedValueMetadataInjectOptions<T>, BaseMultipleResolvedValueMetadataInjectOptions, BaseOptionalResolvedValueMetadataInjectOptions {
}

export interface OptionalResolvedValueMetadataInjectOptions<T> extends BaseResolvedValueMetadataInjectOptions<T>, BaseOptionalResolvedValueMetadataInjectOptions {
}

export interface ResolvedValueMetadataInjectTagOptions {
  key: MetadataTag;
  value: unknown;
}

export type ResolvedValueInjectOptions<T> =
  LazyServiceIdentifier<T>
  | ResolvedValueMetadataInjectOptions<T>
  | ServiceIdentifier<T>;

export type MapToResolvedValueInjectOptions<TArgs extends unknown[]> = {
  [K in keyof TArgs]-?: ResolvedValueInjectOptions<TArgs[K]>;
};