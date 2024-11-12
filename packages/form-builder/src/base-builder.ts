import { Rule, TypeMirror } from '@geckoai/class-transformer';
import { ClassConstructor, ClassMirror } from '@geckoai/class-mirror';
import { ApiPropertyMetadataImpl } from '@geckoai/http';
import type { FormItemBuilder } from './form-item-builder';
import type { FormListBuilder } from './form-list-builder';

export abstract class BaseBuilder<T extends {}, P extends {} = any> {
  public static readonly OMIT_TYPES = [Number, Boolean, String];

  public readonly rules: Map<
    PropertyKey,
    string | string[] | Rule | Rule[] | undefined
  > = new Map();

  public readonly mirror: ClassMirror;

  protected readonly properties: Map<
    PropertyKey,
    FormItemBuilder<any, any, any> | FormListBuilder<any, any, any>
  > = new Map();

  protected readonly metadatas: Map<PropertyKey, ApiPropertyMetadataImpl> =
    new Map();

  protected constructor(
    protected target: TypeMirror<T>,
    protected parent?: BaseBuilder<P>
  ) {
    const elementType = target.elementType();
    const type = target.type() as any;

    if (elementType && elementType.type()) {
      if (type === Array) {
        this.mirror = ClassMirror.reflect(elementType.type());
      } else {
        this.mirror = ClassMirror.reflect(type);
      }
    } else {
      this.mirror = ClassMirror.reflect(type);
    }
    this.init(type);
  }

  abstract init(type: ClassConstructor): void;

  public get<K extends keyof T>(key: K) {
    return this.properties.get(key) as any as T[K] extends object[]
      ? FormListBuilder<T[K], T, K>
      : FormItemBuilder<{}, T, K>;
  }

  public getMetadata(key: PropertyKey) {
    return this.metadatas.get(key);
  }

  public getParents(p: BaseBuilder<any> | null): BaseBuilder<any>[] {
    if (this.parent && p != null) {
      if (this.parent !== p) {
        return [this.parent, ...this.parent.getParents(p)];
      }
    }
    return [];
  }
}
