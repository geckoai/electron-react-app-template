import { ClassDecorate, ClassMirror } from '@geckoai/class-mirror';
import { RouteObject } from 'react-router-dom';
import { ApplyClassDecorators } from '@geckoai/core';

export class GeckoRouteDecorate extends ClassDecorate<Omit<RouteObject, "element">> {
}

export function GeckoRoute(metadata: Omit<RouteObject, "element">): ClassDecorator {
  return ApplyClassDecorators(
    ClassMirror.createDecorator(new GeckoRouteDecorate(
      metadata
    ))
  );
}