import { createHashRouter, createBrowserRouter } from 'react-router-dom';
import { ClassConstructor, ClassMirror } from '@geckoai/class-mirror';
import { ModuleDecorate } from './module';
import { IndexRoute, NoIndexRoute } from './route';
import type { Router as RemixRouter } from '@remix-run/router/dist/router';

export class RouterFactory {
  private static reflect(target: ClassConstructor, parent: NoIndexRoute) {
    const mirror = ClassMirror.reflect(target);
    const decorates = mirror.getDecorates(ModuleDecorate);

    decorates.forEach((value) => {
      const metadata = value.metadata;
      const { children, ...rest } = metadata;
      if (rest.index) {
        if (rest.path) {
          IndexRoute.create({ path: undefined }, parent);
          IndexRoute.create(rest, parent);
        } else {
          IndexRoute.create({ ...rest, alias: 'index.html' }, parent);
          NoIndexRoute.create({ ...rest, path: 'index.html' }, parent);
        }
      } else {
        const noIndexRoute = NoIndexRoute.create(
          {
            ...rest,
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

  public static create(target: ClassConstructor): RemixRouter {
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
}
