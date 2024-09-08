import { AgnosticIndexRouteObject } from '@remix-run/router';
import { ClassConstructor } from '@geckoai/class-mirror';
import qs from 'qs';
import { transformer } from '@packages/utils';
import { useLoaderData } from 'react-router-dom';
export class LoaderFactory {
  public static create<T extends {} = {}>(
    clazz: ClassConstructor<T>
  ): LoadObject<T> {
    return {
      loader: ({ params, context, request }) => {
        const url = new URL(request.url);
        const query = qs.parse(url.search.replace(/^\?/, '')) as Partial<T>;
        const data = transformer.transform(clazz, query) as any;
        data.__datetime = Date.now();
        return data;
      },
      useLoaderData: useLoaderData as Fn<T>,
    };
  }
}

type Fn<R> = () => R;

export interface LoadObject<R = unknown> {
  loader: AgnosticIndexRouteObject['loader'];
  useLoaderData(): R;
}
