import { GeckoModule } from '@geckoai/core';
import { RouterService } from './router-service';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BrowserStartup } from '@geckoai/platform-browser';
import { createElement, PropsWithChildren, useMemo } from 'react';

@GeckoModule({
  providers: [RouterService],
  exports: [RouterService]
})
export class ReactRouter {
  public static Provider({ startup }: PropsWithChildren<{ startup: BrowserStartup<any> }>) {
    const service = startup.container.get(RouterService);
    const routes = useMemo(() => {
      return service?.route ? [service.route] : [];
    }, []);
    const router = createBrowserRouter(routes);
    return createElement(RouterProvider, { router });
  };
}