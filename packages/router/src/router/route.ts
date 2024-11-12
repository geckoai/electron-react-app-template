import type {
  AgnosticIndexRouteObject,
  LazyRouteFunction,
} from '@remix-run/router';
import * as React from 'react';
import { RouteObject } from 'react-router/dist/lib/context';
import { ErrorBoundary } from './ErrorBoundary';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { DepLocale } from '@packages/i18n';
import { createElement } from 'react';
import { AppConfigProvider } from '@packages/components';

class Route {
  public caseSensitive?: AgnosticIndexRouteObject['caseSensitive'];

  public path?: AgnosticIndexRouteObject['path'];

  public icon?: React.ForwardRefExoticComponent<
    Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
  >;

  public id?: AgnosticIndexRouteObject['id'];

  public loader?: AgnosticIndexRouteObject['loader'];

  public action?: AgnosticIndexRouteObject['action'];

  public hasErrorBoundary?: AgnosticIndexRouteObject['hasErrorBoundary'];

  public shouldRevalidate?: AgnosticIndexRouteObject['shouldRevalidate'];

  public handle?: AgnosticIndexRouteObject['handle'];

  public element?: React.ReactNode | null;

  public hydrateFallbackElement?: React.ReactNode | null;

  public errorElement?: React.ReactNode | null;

  public Component?: React.ComponentType | null;

  public HydrateFallback?: React.ComponentType | null;

  public ErrorBoundary?: React.ComponentType | null;

  public lazy?: LazyRouteFunction<RouteObject>;

  public children?: any[];

  public isHideInMenu?: boolean;

  public title?: DepLocale<{ TITLE: string }>;

  public fullPath: string;

  public realPath: string;

  public alias?: string;

  private getFullPath(alias?: boolean): Array<string | undefined> {
    if (this.parent) {
      return [
        ...this.parent.getFullPath(alias),
        alias ? this.alias ?? this.path : this.path,
      ];
    }
    return [alias ? this.alias ?? this.path : this.path];
  }

  public constructor(route: RouteOps, public readonly parent?: Route) {
    this.caseSensitive = route.caseSensitive;
    this.path = route.path;
    this.id = route.id;
    this.loader = route.loader;
    this.lazy = route.lazy;
    this.action = route.action;
    this.hasErrorBoundary = route.hasErrorBoundary;
    this.shouldRevalidate = route.shouldRevalidate;
    this.handle = route.handle;
    this.element = route.element;
    this.hydrateFallbackElement = route.hydrateFallbackElement;
    this.errorElement = route.errorElement;
    this.Component = route.Component;
    this.HydrateFallback = route.HydrateFallback;
    this.ErrorBoundary =
      route.ErrorBoundary ||
      ((props: any) =>
        createElement(AppConfigProvider, {
          children: createElement(ErrorBoundary, { ...props }),
        }));
    this.isHideInMenu = route.isHideInMenu;
    this.title = route.title;
    this.icon = route.icon;
    this.alias = route.alias;
    this.fullPath = this.getFullPath().join('/').replace(/\/+/g, '/');
    this.realPath = this.getFullPath(true).join('/').replace(/\/+/g, '/');
    parent?.children?.push(this);
  }
}

export class IndexRoute extends Route {
  public static create(route: RouteOps, parent?: Route) {
    return new IndexRoute(route, parent);
  }

  public index: true = true;

  public children?: undefined = undefined;
}

export class NoIndexRoute extends Route {
  public static create(route: RouteOps, parent?: Route) {
    return new NoIndexRoute(route, parent);
  }

  public constructor(route: RouteOps, parent?: Route) {
    super(route, parent);
    this.children = route.children;
  }

  public index: false = false;

  public children?: Array<IndexRoute | NoIndexRoute>;
}

export interface RouteOps extends Omit<Route, 'fullPath' | 'realPath'> {}
