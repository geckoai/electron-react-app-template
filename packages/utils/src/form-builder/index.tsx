import { ClassConstructor, ClassMirror } from '@geckoai/class-mirror';
import {
  Button,
  Divider,
  Form,
  FormInstance,
  FormItemProps,
  FormProps,
  Modal,
  ModalProps,
  Row,
  Space,
} from 'antd';
import * as React from 'react';
import {
  Children,
  cloneElement,
  Component,
  createContext,
  createElement,
  FC,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ApiPropertyDecorate, ApiPropertyMetadataImpl } from '@geckoai/http';
import { Rule, TypedDecorate, TypeMirror } from '@geckoai/class-transformer';
import { FormListFieldData, FormListProps } from 'antd/es/form/FormList';
import { LocaleLanguageKey } from '@geckoai/http/dist/types/constants';
import { ActionFunctionArgs } from '@remix-run/router/utils';
import { AxiosResponse } from 'axios';
import { transformer } from '../transformer';
import { useActionData, useSubmit } from 'react-router-dom';
import i18n from '@packages/i18n';

export const FormBuilderContext = createContext<BaseBuilder<any, any> | null>(
  null
);
export const FormLocaleContext = createContext<LocaleLanguageKey>('zh_CN');

abstract class Action<R extends {} = any> {
  protected constructor(private target: ClassConstructor) {}

  abstract action(
    args: ActionFunctionArgs<any>
  ): Promise<AxiosResponse<R> | null>;

  abstract useActionData(): AxiosResponse<R> | null;
}

abstract class BaseBuilder<T extends {}, P extends {} = any> {
  private static OMIT_TYPES = [Number, Boolean, String];

  public readonly rules: Map<
    PropertyKey,
    string | string[] | Rule | Rule[] | undefined
  > = new Map();

  public readonly mirror: ClassMirror;

  private readonly properties: Map<
    PropertyKey,
    FormItemBuilder<any, any, any> | FormListBuilder<any, any, any>
  > = new Map();

  private readonly metadatas: Map<PropertyKey, ApiPropertyMetadataImpl> =
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

  public getAction<R extends { code: string; message: string }>() {
    // const { target } = this;
    return {
      useActionData,
      async action({ request, params }) {
        try {
          // const json = await request.json();
          // return (await UCenterAPI.fetch(
          //   transformer.transform(target.type(), {
          //     ...params,
          //     ...json,
          //   })
          // )) as AxiosResponse<R>;
          throw new Error('Method not implemented');
        } catch (e) {
          throw e;
        }

        return {} as AxiosResponse<R>;
      },
    } as Action<R>;
  }
}

type DepPartial<T> = {
  [P in keyof T]?: T[P] extends any[]
    ? Array<DepPartial<T[P][number]>>
    : DepPartial<T[P]>;
};

export type BuildForm<T> = ((
  props: Omit<
    FormProps<T>,
    'initialValues' | 'action' | 'encType' | 'method'
  > & {
    initialValues?: DepPartial<T>;
  }
) => React.ReactElement) & {
  Item: FC<
    Omit<FormItemProps<T>, 'children'> & {
      children: ((form: FormInstance<T>) => React.ReactNode) | React.ReactNode;
    }
  >;
};

export class FormBuilder<T extends {}> extends BaseBuilder<T> {
  private __props: any;

  constructor(target: TypeMirror<T>) {
    super(target, undefined);

    this.setProps = this.setProps.bind(this);
    this.build = this.build.bind(this);
    this.buildModal = this.buildModal.bind(this);
  }

  public static create<T extends {}>(clazz: ClassConstructor<T>) {
    return new FormBuilder<T>(TypeMirror.createObjectMirror(clazz));
  }

  public setProps(
    props: Omit<
      FormProps,
      | 'initialValues'
      | 'onFinish'
      | 'onFinishFailed'
      | 'onFieldsChange'
      | 'action'
      | 'encType'
      | 'method'
    > & {
      initialValues?: DepPartial<T>;
    }
  ) {
    this.__props = props;
    return this;
  }

  public build(action: string = ''): BuildForm<T> {
    const fc: BuildForm<T> = (
      props: Omit<FormProps<T>, 'initialValues'> & {
        initialValues?: DepPartial<T>;
      }
    ) => {
      const { onFinish, ...rest } = props as any;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const submit = useSubmit();
      return (
        <FormBuilderContext.Provider value={this}>
          <Form
            {...(rest as any)}
            onFinishFailed={(e) => {
              console.warn(e);
              props.onFinishFailed?.(e);
            }}
            onFinish={(values) => {
              if (props.onFinish) {
                props.onFinish?.(values);
              } else {
                submit(values, {
                  action,
                  encType: 'application/json',
                  method: 'post',
                });
              }
            }}
          />
        </FormBuilderContext.Provider>
      );
    };
    fc.Item = Form.Item;
    return fc;
  }

  public buildModal() {
    const BuildForm = this.build();

    const fc = (props: {
      initialValues?: DepPartial<T>;
      modalProps?: Omit<ModalProps, 'visible' | 'onOk'>;
      formProps?: Omit<FormProps, 'initialValues'> & {
        onRequest?: (
          values: DepPartial<T>
        ) => DepPartial<T> | Promise<DepPartial<T>>;
        onResponse?: <V>(response: AxiosResponse<V, T>) => void | Promise<void>;
        onRequestFailed?: (e: unknown) => void;
      };
      children?: FormProps['children'];
    }) => {
      const { modalProps, formProps, initialValues, children } = props;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [loading, setLoading] = useState<boolean>();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const lang = useContext(FormLocaleContext);
      const locale = i18n.localeData(lang);
      const { onRequest, onResponse, onRequestFailed, ...formPropsRest } =
        formProps || {};

      return (
        <Modal
          {...modalProps}
          open={Boolean(initialValues)}
          footer={null}
          destroyOnClose
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <BuildForm
            {...formPropsRest}
            initialValues={initialValues}
            onFinish={async (values) => {
              formProps?.onFinish?.(values);
              try {
                const data = (await onRequest?.(values)) ?? values;
                setLoading(true);
                console.log(data, 'data');
                console.log(
                  transformer.transform(this.target.type(), data),
                  'transform data'
                );
                // const res = await UCenterAPI.fetch(
                //   transformer.transform(this.target.type(), data)
                // );
                // await onResponse?.(res);

                throw new Error('Method not implemented');
              } catch (err) {
                await onRequestFailed?.(err);
              } finally {
                setLoading(false);
              }
            }}
          >
            {typeof children === 'function' ? (
              (values, form) => (
                <>
                  <div
                    style={{
                      paddingTop: 10,
                    }}
                  >
                    {typeof children === 'function'
                      ? children(values, form)
                      : children}
                  </div>

                  <Divider style={{ marginBottom: 0 }} />
                  <Row justify="end">
                    <Space style={{ padding: '10px 20px' }}>
                      <Button
                        onClick={modalProps?.onCancel}
                        children={modalProps?.cancelText || locale.UI.CANCEL}
                        {...modalProps?.cancelButtonProps}
                      />

                      <Button
                        loading={loading || modalProps?.confirmLoading}
                        type="primary"
                        children={modalProps?.okText || locale.UI.SAVE}
                        htmlType="submit"
                        {...modalProps?.okButtonProps}
                      />
                    </Space>
                  </Row>
                </>
              )
            ) : (
              <>
                <div
                  style={{
                    paddingTop: 10,
                  }}
                >
                  {children}
                </div>

                <Divider style={{ marginBottom: 0 }} />
                <Row justify="end">
                  <Space style={{ padding: '10px 0' }}>
                    <Button
                      onClick={modalProps?.onCancel}
                      children={modalProps?.cancelText || locale.UI.CANCEL}
                      {...modalProps?.cancelButtonProps}
                    />

                    <Button
                      loading={loading || modalProps?.confirmLoading}
                      type="primary"
                      children={modalProps?.okText || locale.UI.SAVE}
                      htmlType="submit"
                      {...modalProps?.okButtonProps}
                    />
                  </Space>
                </Row>
              </>
            )}
          </BuildForm>
        </Modal>
      );
    };

    fc.Item = Form.Item;

    return fc;
  }
}

export class FormItemBuilder<
  T extends {},
  P extends {},
  K extends keyof P
> extends BaseBuilder<T> {
  constructor(
    target: TypeMirror<T>,
    parent: BaseBuilder<P>,
    public readonly propertyKey: K
  ) {
    super(target, parent);
  }

  public build<Props>(
    element?: FC<Props> | Component<Props>,
    elementProps?: Props
  ) {
    const { parent, propertyKey } = this;
    const metadata = parent?.getMetadata(propertyKey);
    const _this = this;
    return (
      props: Omit<FormItemProps, 'initialValue' | 'name'> & {
        buildLabel?: boolean;
        buildPlaceholder?: boolean;
        initialValue?: P[K];
        // 在FormList中使用时必传
        fieldIndex?: string | number;
      }
    ) => {
      const { buildLabel = true, children, fieldIndex, ...rest } = props;
      const context = useContext(FormBuilderContext);
      const locale = useContext(FormLocaleContext);

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

      if (buildLabel && metadata?.locales?.[locale]) {
        rest.label = metadata.locales[locale];
      }

      return (
        <FormBuilderContext.Provider value={this}>
          <Form.Item
            {...rest}
            name={namePath}
            children={
              element
                ? createElement(element as any, {
                    ...elementProps,
                    placeholder: rest.label,
                  })
                : cloneElement(Children.only(children) as any, {
                    placeholder: rest.label,
                  })
            }
          />
        </FormBuilderContext.Provider>
      );
    };
  }
}

export interface FormListOperation<T> {
  add: (defaultValue?: T, insertIndex?: number) => void;
  remove: (index: number | number[]) => void;
  move: (from: number, to: number) => void;
}

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

  public build() {
    const { propertyKey } = this;
    const _this = this;
    return (
      props: Omit<FormListProps, 'name' | 'initialValue' | 'children'> & {
        initialValue?: P[K] extends any[]
          ? Array<Partial<P[K][number]>>
          : never;
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
      }
    ) => {
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
}
