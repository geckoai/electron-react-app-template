import { TypedDecorate, TypeMirror } from '@geckoai/class-transformer';
import { ClassConstructor } from '@geckoai/class-mirror';
import {
  Button,
  Divider,
  Form,
  FormProps,
  Modal,
  ModalProps,
  Row,
  Space,
} from '@packages/components';
import { useActionData, useSubmit } from 'react-router-dom';
import { transformer } from '@packages/utils';
import { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import { i18n, I18nContext } from '@packages/i18n';
import { BaseBuilder } from './base-builder';
import { ApiPropertyDecorate, HttpClient } from '@geckoai/http';
import { Action, BuildForm, DepPartial, FormBuilderContext } from './context';
import { FormListBuilder } from './form-list-builder';
import { FormItemBuilder } from './form-item-builder';

export class FormBuilder<T extends {}> extends BaseBuilder<T> {
  private __props: any;

  constructor(private api: HttpClient, target: TypeMirror<T>) {
    super(target, undefined);

    this.setProps = this.setProps.bind(this);
    this.build = this.build.bind(this);
    this.buildModal = this.buildModal.bind(this);
  }

  public static create<T extends {}>(
    api: HttpClient,
    clazz: ClassConstructor<T>
  ) {
    return new FormBuilder<T>(api, TypeMirror.createObjectMirror(clazz));
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

  public getAction<R extends { code: string; message: string }>() {
    const { target, api } = this;
    return {
      useActionData,
      async action({ request, params }) {
        try {
          const json = await request.json();
          return (await api.fetch(
            transformer.transform(target.type(), {
              ...params,
              ...json,
            })
          )) as AxiosResponse<R>;
        } catch (e) {
          console.log(e);
          throw e;
        }
      },
    } as Action<R>;
  }

  public build(action: string = ''): BuildForm<T> {
    const fc: BuildForm<T> = (props) => {
      const { onFinish, ...rest } = props as any;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const submit = useSubmit();
      return (
        <FormBuilderContext.Provider value={this}>
          <Form
            {...(rest as any)}
            onFinishFailed={(e) => {
              props.onFinishFailed?.(e);
            }}
            onFinish={(values) => {
              if (props.onFinish) {
                props.onFinish?.(
                  transformer.transform(this.target, values),
                  (args: any) => {
                    submit(args, {
                      action,
                      encType: 'application/json',
                      method: 'post',
                    });
                  }
                );
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
    const api = this.api;
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
      const locale = useContext(I18nContext);
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
              if (formProps?.onFinish) {
                formProps?.onFinish?.(values);
                return;
              }
              try {
                const data = (await onRequest?.(values)) ?? values;
                setLoading(true);
                const res = await api.fetch(
                  transformer.transform(this.target.type(), data)
                );
                await onResponse?.(res as any);
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
