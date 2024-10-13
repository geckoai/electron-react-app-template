import { ClassConstructor } from '@geckoai/class-mirror';
import { useActionData } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { HttpException } from '@geckoai/http';
import { ActionFunctionArgs } from '@remix-run/router/utils';
import { API } from '../http';
import { transformer } from '@packages/utils';

abstract class Action<R extends {}> {
  protected constructor(private target: ClassConstructor) {}

  abstract action(
    args: ActionFunctionArgs<any>
  ): Promise<AxiosResponse<R> | null>;

  abstract useActionData(): AxiosResponse<R> | null;
}

export class ActionFactory {
  public static create<R extends {}>(target: ClassConstructor): Action<R> {
    return {
      useActionData,
      async action({ request, params }) {
        try {
          const json = await request.json();
          return (await API.fetch(
            transformer.transform(target, {
              ...params,
              ...json,
            })
          )) as AxiosResponse<R>;
        } catch (e) {
          if (e instanceof HttpException) {
            return null;
          }
          throw e;
        }
      },
    } as Action<R>;
  }
}
