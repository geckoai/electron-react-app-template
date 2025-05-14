import { ComponentType, createElement, PropsWithChildren, ReactNode } from 'react';
import { Bootstrap, Newable } from '@geckoai/core';
import { Container } from 'inversify';


export class BrowserStartup<T extends object> {
  public readonly instance: T;
  public readonly container: Container;

  public constructor(private newable: Newable<T>) {
    const { instance, container } = Bootstrap.run(newable);
    this.instance = instance;
    this.container = container;
  }

  public static module<T extends object>(newable: Newable<T>) {
    return new BrowserStartup(newable);
  }

  private static createElements(elements: ComponentType<PropsWithChildren>[]): ReactNode {
    const [Component, ...features] = elements;
    if (Component) {
      return createElement(Component, {
        children: BrowserStartup.createElements(features)
      });
    }
    return null;
  }
}