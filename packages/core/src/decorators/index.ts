import { ClassMirror } from '@geckoai/class-mirror';
import { BindingScope, injectable } from 'inversify';
import { GeckoModuleDecorate, GeckoModuleIml } from '../interfaces';

export { inject, injectable, Container } from 'inversify';

export type { Newable } from 'inversify';

export function ApplyClassDecorators(...args: ClassDecorator[]): ClassDecorator {
  return (target) => {
    args.forEach((arg) => arg(target));
  };
}

export function GeckoModule<TFunction extends Function>(target: TFunction): TFunction | void;
export function GeckoModule(metadata: Partial<GeckoModuleIml>, scope?: BindingScope): ClassDecorator;
export function GeckoModule(...args: unknown[]): ClassDecorator | (Function | void) {
  const arg = args[0];
  if (typeof arg === 'function') {
    return ApplyClassDecorators(
      ClassMirror.createDecorator(new GeckoModuleDecorate<null>(null)),
      injectable()
    )(arg as any)
  }
  const [metadata, scope] = args as [  Partial<GeckoModuleIml>,  BindingScope]
  return ApplyClassDecorators(
    ClassMirror.createDecorator(new GeckoModuleDecorate(
      metadata
    )),
    injectable(scope)
  );
}