import type { FormListFieldData, FormListProps } from 'antd/es/form/FormList';
import { TypedDecorate, TypeMirror } from '@geckoai/class-transformer';
import {
  Children,
  cloneElement,
  Component,
  createElement,
  FC,
  useContext,
  useMemo,
} from 'react';
import { Form, FormItemProps } from '@packages/components';
import { FormItemBuilder } from './form-item-builder';
import { ClassConstructor } from '@geckoai/class-mirror';
import { ApiPropertyDecorate } from '@geckoai/http';
import { BaseBuilder } from './base-builder';
import { FormBuilderContext, FormListOperation } from './context';
import { I18n } from '@packages/i18n';

export class FormListBuilder<
  V extends {},
  P extends {},
  K extends keyof P,
  T extends {} = V extends any[] ? V[number] : never
> extends BaseBuilder<T> {
  constructor(
    target: TypeMirror<T>,
    parent: BaseBuilder<P>,
    public readonly propertyKey: K
  ) {
    super(target as any, parent);
  }

  public init(type: ClassConstructor) {
    this.mirror.getAllProperties().forEach((value, key) => {
      const decorates = value.getDecorates(TypedDecorate);
      const apiPropertyDecorates = value.getDecorates(ApiPropertyDecorate);

      decorates.forEach((d) => {
        if (d.metadata.type) {
          if (type === Array) {
            this.rules.set(key, d.metadata.options?.elementRules);
          } else {
            this.rules.set(key, d.metadata.options?.rules);
          }
          this.properties.set(
            key,
            d.metadata.type?.type() === Array &&
              !BaseBuilder.OMIT_TYPES.includes(
                d.metadata.type?.elementType()?.type()
              )
              ? new FormListBuilder(d.metadata.type, this, key as any)
              : new FormItemBuilder(d.metadata.type, this, key as any)
          );
        }
      });
      apiPropertyDecorates.forEach((d) => {
        if (d.metadata) {
          this.metadatas.set(key, d.metadata);
        }
      });
    });
  }

  public build<Props>(
    element: FC<Props> | Component<Props>,
    elementProps?: Props
  ): FC<Props>;

  public build(): ListProps<V, P, K, T>;

  public build<Props>(
    element?: FC<Props> | Component<Props>,
    elementProps?: Props
  ): any {
    if (element) {
      return this.buildItem(element, elementProps) as any;
    }

    const { propertyKey } = this;
    const _this = this;
    return (props: ListProps<V, P, K, T>) => {
      const { fieldIndex, initialValue, ...rest } = props;
      const context = useContext(FormBuilderContext);
      const namePath = useMemo(() => {
        const copy = [];

        _this
          ?.getParents(context)
          ?.reverse()
          .forEach((o) => {
            if (o instanceof FormItemBuilder || o instanceof FormListBuilder) {
              copy.push(o.propertyKey);
            }
          });

        if (context instanceof FormListBuilder) {
          copy.push(fieldIndex);
        }
        copy.push(propertyKey);
        return copy;
      }, [context, fieldIndex]);

      return (
        <FormBuilderContext.Provider value={this}>
          <Form.List
            {...rest}
            name={namePath as any}
            initialValue={initialValue as any}
          />
        </FormBuilderContext.Provider>
      );
    };
  }

  public buildItem<Props>(
    element?: FC<Props> | Component<Props>,
    elementProps?: Props
  ) {
    const { parent, propertyKey } = this;
    const metadata = parent?.getMetadata(propertyKey);

    const _this = this;
    return (
      props: Omit<FormItemProps, 'initialValue' | 'name'> & {
        noLabel?: boolean;
        noPlaceholder?: boolean;
        initialValue?: P[K];
        // 在FormList中使用时必传
        fieldIndex?: string | number;
        placeholder?: string;
      }
    ) => {
      const {
        noLabel = true,
        noPlaceholder = true,
        fieldIndex,
        ...rest
      } = props;
      const context = useContext(FormBuilderContext);

      rest.rules = rest.rules || [{ required: false }];

      const namePath = useMemo(() => {
        const copy: any[] = [];
        _this
          ?.getParents(context)
          ?.reverse()
          .forEach((o) => {
            if (o instanceof FormItemBuilder || o instanceof FormListBuilder) {
              copy.push(o.propertyKey);
            }
          });
        if (context instanceof FormListBuilder) {
          copy.push(fieldIndex);
        }
        copy.push(propertyKey);
        return copy;
      }, [context, fieldIndex]);

      if (metadata?.required) {
        if (!rest.rules.filter((o: any) => o?.required).length) {
          rest.rules.push({ required: true });
        }
      }

      if (rest.rules.length === 0) {
        rest.rules.push({ required: false });
      }

      const lc = metadata?.locale
        ? I18n.current<string>(metadata.locale)
        : undefined;

      if (lc) {
        if (!noLabel) {
          rest.label = lc;
        }

        if (!noPlaceholder) {
          rest.placeholder = lc;
        }
      }

      if (rest.children) {
        if (typeof rest.children !== 'function') {
          rest.children = cloneElement(Children.only(rest.children) as any, {
            placeholder: rest.placeholder,
          });
        }
      } else if (element) {
        rest.children = createElement(element as any, {
          placeholder: rest.placeholder,
          ...elementProps,
        });
      }

      return (
        <FormBuilderContext.Provider value={this}>
          <Form.Item {...rest} name={namePath} />
        </FormBuilderContext.Provider>
      );
    };
  }
}

export type ListProps<
  V extends {},
  P extends {},
  K extends keyof P,
  T extends {} = V extends any[] ? V[number] : never
> = Omit<FormListProps, 'name' | 'initialValue' | 'children'> & {
  initialValue?: P[K] extends any[] ? Array<Partial<P[K][number]>> : never;
  // 在FormList中使用时必传
  fieldIndex?: string | number;
  children: (
    fields: FormListFieldData[],
    operation: FormListOperation<T>,
    meta: {
      errors: React.ReactNode[];
      warnings: React.ReactNode[];
    }
  ) => React.ReactNode;
};
