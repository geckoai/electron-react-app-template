import {
  ClassMirror,
  ClassDecorate,
  ClassConstructor,
} from '@geckoai/class-mirror';
import { IndexRoute, NoIndexRoute } from './route';
import * as React from 'react';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { DepLocale } from '@packages/i18n';

export class ModuleDecorate extends ClassDecorate<RouteImpl> {}

export interface RouteImpl
  extends Omit<NoIndexRoute | IndexRoute, 'children' | 'index' | 'fullPath'> {
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
