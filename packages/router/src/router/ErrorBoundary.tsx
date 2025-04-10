import { Result } from '@packages/components';

export function ErrorBoundary() {
  return <Result status="error" title="Error" />;
}
