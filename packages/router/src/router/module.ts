import {
  ClassMirror,
  ClassDecorate,
  ClassConstructor,
} from '@geckoai/class-mirror';
import validator from 'validator';
import { IndexRoute, NoIndexRoute } from './route';
import * as React from 'react';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { DepLocale } from '@packages/i18n';
import { v4 } from 'uuid';

export class ModuleDecorate extends ClassDecorate<RouteImpl> {}

export interface RouteImpl
  extends Omit<
    NoIndexRoute | IndexRoute,
    'children' | 'index' | 'fullPath' | 'realPath'
  > {
  children?: Array<ClassConstructor>;
  index?: boolean;
  isHideInMenu?: boolean;
  icon?: React.ForwardRefExoticComponent<
    Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
  >;
  title?: DepLocale<{ TITLE: string }>;
}

export function Module(decorate: RouteImpl): ClassDecorator {
  return ClassMirror.createDecorator(new ModuleDecorate(decorate));
}

export function ExtModule(
  decorate: RouteImpl & { id: string }
): ClassDecorator {
  if (!validator.isUUID(decorate?.id ?? '')) {
    throw new Error('The id is must be uuid, Recommended use ' + v4());
  }
  return ClassMirror.createDecorator(new ModuleDecorate(decorate));
}
