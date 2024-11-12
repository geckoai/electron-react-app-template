import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import { ClassConstructor, ClassMirror } from '@geckoai/class-mirror';
import { ModuleDecorate } from './module';
import { IndexRoute, NoIndexRoute } from './route';
import type { AgnosticIndexRouteObject } from '@remix-run/router';
import { DepLocale, I18n } from '@packages/i18n';

export class RouterFactory {
  private static loader(
    title: DepLocale<{ TITLE: string }>,
    loader: AgnosticIndexRouteObject['loader']
  ): AgnosticIndexRouteObject['loader'] {
    return (...args) => {
      document.title = I18n.current<string>(title.TITLE);
      if (typeof loader === 'function') {
        return loader(...args);
      }
      return null;
    };
  }

  private static RouteRegistry = new Map<ClassConstructor, ModuleDecorate>();

  private static reflect(target: ClassConstructor, parent: NoIndexRoute) {
    const mirror = ClassMirror.reflect(target);
    const decorates = mirror.getDecorates(ModuleDecorate);

    decorates.forEach((value) => {
      const metadata = value.metadata;
      const { children, title, ...rest } = metadata;
      const loader = title
        ? RouterFactory.loader(title, rest.loader)
        : rest.loader;

      if (rest.index) {
        IndexRoute.create(
          {
            ...rest,
            path: undefined,
            alias: undefined,
            title,
            loader,
          },
          parent
        );

        // NoIndexRoute.create(
        //   {
        //     ...rest,
        //     isHideInMenu: true,
        //     path: 'index.html',
        //     alias: undefined,
        //     title,
        //     loader,
        //   },
        //   parent
        // );
      } else {
        const noIndexRoute = NoIndexRoute.create(
          {
            ...rest,
            title,
            loader,
            children: [],
          },
          parent
        );
        let noIndexRouteAlisa: NoIndexRoute;
        if (rest.alias) {
          noIndexRouteAlisa = NoIndexRoute.create(
            {
              ...rest,
              path: rest.alias,
              title,
              loader,
              isHideInMenu: true,
              children: [],
            },
            parent
          );
        }
        children?.forEach((o) => {
          RouterFactory.reflect(o, noIndexRoute);
          if (noIndexRouteAlisa) {
            RouterFactory.reflect(o, noIndexRouteAlisa);
          }
        });
      }
    });
  }

  public static form(route: NoIndexRoute | IndexRoute, basename?: string) {
    if (
      process.env.APP_RUNTIME_ENV === 'web' ||
      process.env.NODE_ENV === 'development'
    ) {
      return createBrowserRouter([route], { basename });
    }
    return createHashRouter([route], { basename });
  }

  public static generate(target: ClassConstructor): NoIndexRoute {
    const root = NoIndexRoute.create({ path: '', children: [] });
    RouterFactory.reflect(target, root);
    return root;
  }

  public static create(target: ClassConstructor) {
    const root = NoIndexRoute.create({ path: '', children: [] });
    RouterFactory.reflect(target, root);
    if (
      process.env.APP_RUNTIME_ENV === 'web' ||
      process.env.NODE_ENV === 'development'
    ) {
      return createBrowserRouter([root], {});
    }
    return createHashRouter([root], {});
  }

  public static register(target: ClassConstructor) {
    const mirror = ClassMirror.reflect(target);
    const decorates = mirror.getDecorates(ModuleDecorate);
    const decorate = decorates.find((x) => x.metadata);
    if (decorate) {
      RouterFactory.RouteRegistry.set(target, decorate);
    }
  }

  public static registers(...targets: ClassConstructor[]) {
    return targets.forEach(RouterFactory.register);
  }

  public static getRoutes() {
    return Array.from(RouterFactory.RouteRegistry.values());
  }
}
