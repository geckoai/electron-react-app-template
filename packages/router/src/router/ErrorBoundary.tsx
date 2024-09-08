import { useRouteError } from 'react-router-dom';
import { Result } from 'antd';

export function ErrorBoundary() {
  const error: any = useRouteError();

  console.log(error);

  if (error.isAxiosError) {
    const { data } = error.response;
    return (
      <Result status="500" title={data?.code} subTitle={data?.message}>
        {process.env.NODE_ENV === 'development' && (
          <code style={{ whiteSpace: 'pre' }}>{error?.stack}</code>
        )}
      </Result>
    );
  }

  if (error.status) {
    return (
      <Result
        status={error?.status || 404}
        title={error?.statusText}
        subTitle={error?.data}
      >
        {process.env.NODE_ENV === 'development' && (
          <code style={{ whiteSpace: 'pre' }}>{error?.error?.stack}</code>
        )}
      </Result>
    );
  }

  return (
    <Result status="500" title="Error" subTitle={error.message}>
      {process.env.NODE_ENV === 'development' && (
        <code style={{ whiteSpace: 'pre' }}>{error?.stack}</code>
      )}
    </Result>
  );
}
