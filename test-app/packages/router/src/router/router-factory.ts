import { createMemoryRouter } from 'react-router-dom';
import { ClassConstructor, ClassMirror } from '@geckoai/class-mirror';
import { ModuleDecorate } from './module';
import { IndexRoute, NoIndexRoute } from './route';

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
        children?.forEach((o) => {
          RouterFactory.reflect(o, noIndexRoute);
        });
      }
    });
  }

  public static create(target: ClassConstructor) {
    const root = NoIndexRoute.create({ path: '', children: [] });
    RouterFactory.reflect(target, root);
    return createMemoryRouter([root], {});
  }
}
