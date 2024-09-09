import {
  Button,
  Dropdown,
  Row,
  Space,
  Table,
  TableProps,
  Typography,
} from 'antd';
import { ClassConstructor, ClassMirror } from '@geckoai/class-mirror';
import { TypeMirror } from '@geckoai/class-transformer';
import { ApiPropertyDecorate, ApiPropertyMetadataImpl } from '@geckoai/http';
import { LocaleLanguageKey } from '@geckoai/http/dist/types/constants';
import { ReactNode, useContext, useMemo, useState } from 'react';
import { I18nContext } from '@packages/i18n';
import { ColumnGroupType, ColumnType } from 'antd/lib/table/interface';
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons';

export class TableColumnBuilder<T extends object> {
  public static create<T extends object>(
    key: string,
    dataIndex: string,
    metadataMapping: Map<PropertyKey, ApiPropertyMetadataImpl>
  ) {
    return new TableColumnBuilder<T>(key, dataIndex, metadataMapping);
  }

  private visible: boolean = false;

  private __restProps: ColumnType<T> | ColumnGroupType<T> | InitHandler<T> = {};

  constructor(
    public readonly key: string,
    public readonly dataIndex: string,
    private metadataMapping: Map<PropertyKey, ApiPropertyMetadataImpl>
  ) {}

  public initProps(props: ColumnType<T> | ColumnGroupType<T> | InitHandler<T>) {
    this.__restProps = props;
    return this;
  }

  public setVisible(visible: boolean): this {
    this.visible = visible;
    return this;
  }

  public build(locale: LocaleLanguageKey): ColumnType<T> | ColumnGroupType<T> {
    const metadata = this.metadataMapping.get(this.dataIndex);
    if (typeof this.__restProps === 'function') {
      return {
        key: this.key,
        dataIndex: this.dataIndex,
        title: metadata?.locales?.[locale] || metadata?.description,
        ...this.__restProps(locale, this.metadataMapping),
      };
    }
    return {
      key: this.key,
      dataIndex: this.dataIndex,
      title: metadata?.locales?.[locale] || metadata?.description,
      ...this.__restProps,
    };
  }
}

export class TableBuilder<T extends object> {
  private readonly mirror: ClassMirror;

  private readonly metadatas: Map<PropertyKey, ApiPropertyMetadataImpl> =
    new Map();

  private readonly keys: string[] = [];

  constructor(protected target: TypeMirror<T>) {
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
      const apiPropertyDecorates = value.getDecorates(ApiPropertyDecorate);
      apiPropertyDecorates.forEach((d) => {
        if (d.metadata) {
          this.metadatas.set(key, d.metadata);
        }
      });
    });

    this.createKey = this.createKey.bind(this);
  }

  private createKey(): string {
    const key = [
      Math.floor(Math.random() * 256).toString(16),
      Math.floor(Math.random() * 256).toString(16),
      Math.floor(Math.random() * 256).toString(16),
      Math.floor(Math.random() * 256).toString(16),
    ]
      .join('')
      .toUpperCase();

    if (this.keys.includes(key)) {
      return this.createKey();
    }
    return key;
  }

  public get<K extends keyof T>(key?: K): TableColumnBuilder<T> {
    return TableColumnBuilder.create(
      this.createKey(),
      key as any,
      this.metadatas
    );
  }

  public build(ops: { rowKey: keyof T }) {
    return (props: ITableProps<T>) => {
      const { title, size, columns = [], onReload, ...rest } = props;
      const locale = useContext(I18nContext);
      const [iSize, setISize] = useState(size);
      const cols = useMemo(
        () => columns.map((x) => x.build(locale.code as LocaleLanguageKey)),
        [columns, locale.code]
      );
      return (
        <div>
          <Row
            justify="space-between"
            style={{ marginBottom: 10 }}
            align="middle"
          >
            {typeof title === 'string' ? (
              <Typography.Title level={5}>{title}</Typography.Title>
            ) : (
              title ?? <div />
            )}
            <Space>
              <Button
                loading={rest.loading}
                icon={<ReloadOutlined />}
                onClick={() => onReload?.()}
              />
              <Dropdown
                destroyPopupOnHide
                menu={{
                  selectedKeys: iSize ? [iSize] : [],
                  onClick: (e) => setISize(e.key as any),
                  items: [
                    { key: 'large', label: locale.UI.LARGE },
                    { key: 'middle', label: locale.UI.MIDDLE },
                    { key: 'small', label: locale.UI.SMALL },
                  ],
                }}
              >
                <Button icon={<ColumnHeightOutlined />} />
              </Dropdown>
            </Space>
          </Row>

          <Table size={iSize} columns={cols} rowKey={ops?.rowKey} {...rest} />
        </div>
      );
    };
  }

  public static create<T extends {}>(clazz: ClassConstructor<T>) {
    return new TableBuilder<T>(TypeMirror.createObjectMirror(clazz));
  }
}

export interface ITableProps<T extends object>
  extends Omit<TableProps<T>, 'columns' | 'title'> {
  columns?: TableColumnBuilder<T>[];
  title?: ReactNode;
  onReload?: () => void;
}

export type InitHandler<T> = (
  locale: LocaleLanguageKey,
  metadata?: Map<PropertyKey, ApiPropertyMetadataImpl>
) => ColumnType<T> | ColumnGroupType<T>;
