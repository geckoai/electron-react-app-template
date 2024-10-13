import { Button, Modal, Result } from '@packages/components';
import { useNavigate, useRouteError } from 'react-router-dom';
import { useContext } from 'react';
import { I18nContext } from '@packages/i18n';

export function ErrorBoundary() {
  const navigate = useNavigate();
  const locale = useContext(I18nContext);
  const error = useRouteError() as any;

  if (error?.constructor?.name === 'ErrorResponseImpl') {
    const { data, status, statusText } = error;
    return (
      <Result
        status="500"
        title={status}
        subTitle={statusText}
        extra={[
          <Button
            children={locale.UI.CUSTOMER_SERVICE}
            onClick={() => navigate('/', { replace: true })}
          />,
          <Button
            hidden={process.env.NODE_ENV !== 'development'}
            children={locale.UI.VIEW_ERROR_MESSAGE}
            type="primary"
            danger
            onClick={() =>
              Modal.error({
                content: data,
              })
            }
          />,
          <Button
            type="primary"
            children={locale.UI.RE_LOGIN}
            onClick={() => navigate('/', { replace: true })}
          />,
        ]}
      />
    );
  }

  if (error.isAxiosError) {
    const { data } = error.response;
    return (
      <Result
        status="error"
        title={data?.code}
        subTitle={data?.message}
        extra={[
          <Button
            children={locale.UI.CUSTOMER_SERVICE}
            onClick={() => navigate('/', { replace: true })}
          />,
          <Button
            type="primary"
            danger
            hidden={process.env.NODE_ENV !== 'development'}
            children={locale.UI.VIEW_ERROR_MESSAGE}
            onClick={() =>
              Modal.error({
                content: error?.stack,
              })
            }
          />,
          <Button
            type="primary"
            children={locale.UI.RE_LOGIN}
            onClick={() => navigate('/', { replace: true })}
          />,
        ]}
      />
    );
  }

  if (error.status) {
    return (
      <Result
        status={error?.status || 'error'}
        title={error?.statusText}
        subTitle={error?.data}
        extra={[
          <Button
            children={locale.UI.CUSTOMER_SERVICE}
            onClick={() => navigate('/', { replace: true })}
          />,
          <Button
            type="primary"
            danger
            hidden={process.env.NODE_ENV !== 'development'}
            children={locale.UI.VIEW_ERROR_MESSAGE}
            onClick={() =>
              Modal.error({
                content: error?.error?.stack,
              })
            }
          />,
          <Button
            type="primary"
            children={locale.UI.RE_LOGIN}
            onClick={() => navigate('/', { replace: true })}
          />,
        ]}
      />
    );
  }

  return (
    <Result
      status="error"
      title="Error"
      subTitle={error.message}
      extra={[
        <Button
          children={locale.UI.CUSTOMER_SERVICE}
          onClick={() => navigate('/', { replace: true })}
        />,
        <Button
          type="primary"
          danger
          hidden={process.env.NODE_ENV !== 'development'}
          children={locale.UI.VIEW_ERROR_MESSAGE}
          onClick={() =>
            Modal.error({
              content: error?.stack,
            })
          }
        />,
        <Button
          type="primary"
          children={locale.UI.RE_LOGIN}
          onClick={() => navigate('/', { replace: true })}
        />,
      ]}
    />
  );
}
