import { createContext, FC, ReactElement, ReactNode } from 'react';
import { BaseBuilder } from './base-builder';
import { ClassConstructor } from '@geckoai/class-mirror';
import type { ActionFunctionArgs } from '@remix-run/router/utils';
import { AxiosResponse } from 'axios';
import { FormInstance, FormItemProps, FormProps } from '@packages/components';

export const FormBuilderContext = createContext<BaseBuilder<any, any> | null>(
  null
);
export abstract class Action<R extends {} = any> {
  protected constructor(private target: ClassConstructor) {}

  abstract action(
    args: ActionFunctionArgs<any>
  ): Promise<AxiosResponse<R> | null>;

  abstract useActionData(): AxiosResponse<R> | null;
}

export type BuildForm<T> = ((
  props: Omit<
    FormProps<T>,
    'initialValues' | 'action' | 'encType' | 'method' | 'onFinish'
  > & {
    initialValues?: DepPartial<T>;
    onFinish?: (args: T, submit: (value: T) => void) => void;
  }
) => ReactElement) & {
  Item: FC<
    Omit<FormItemProps<T>, 'children'> & {
      children: ((form: FormInstance<T>) => ReactNode) | ReactNode;
    }
  >;
};

export interface FormListOperation<T> {
  add: (defaultValue?: T, insertIndex?: number) => void;
  remove: (index: number | number[]) => void;
  move: (from: number, to: number) => void;
}

export type DepPartial<T> = {
  [P in keyof T]?: T[P] extends any[]
    ? Array<DepPartial<T[P][number]>>
    : DepPartial<T[P]>;
};
