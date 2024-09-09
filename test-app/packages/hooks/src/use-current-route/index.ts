import { useContext } from 'react';
import { IndexRoute, NoIndexRoute } from '@packages/router';
import { UNSAFE_RouteContext } from 'react-router-dom';

export function useCurrentRoute(): NoIndexRoute | IndexRoute {
  const context = useContext(UNSAFE_RouteContext);
  return context?.matches[context.matches.length - 1]?.route as any;
}
