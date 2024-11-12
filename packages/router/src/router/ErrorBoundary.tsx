import { Button, Result } from '@packages/components';
import { useNavigate, useRouteError } from 'react-router-dom';
import { useContext } from 'react';
import { I18nContext } from '@packages/i18n';

import NOTFOUND from '../assets/404.svg';
import QUESTION from '../assets/question.svg';

export function ErrorBoundary() {
  const navigate = useNavigate();
  const locale = useContext(I18nContext);
  const error = useRouteError() as any;

  if (error?.constructor?.name === 'ErrorResponseImpl') {
    const { status, statusText } = error;
    return (
      <Result
        status="error"
        title={status}
        icon={
          <img alt="not_found" src={status === 404 ? NOTFOUND : QUESTION} />
        }
        subTitle={statusText}
        extra={[
          <Button
            key="CUSTOMER_SERVICE"
            children={locale.UI.CUSTOMER_SERVICE}
            onClick={() => navigate('/', { replace: true })}
          />,
          <Button
            key="BACK_HOME"
            type="primary"
            children={locale.UI.BACK_HOME}
            onClick={() => navigate('/', { replace: true })}
          />,
        ]}
      />
    );
  }

  if (error.isAxiosError) {
    const { data, status, message } = error.response;
    return (
      <Result
        status="error"
        title={status}
        subTitle={message ?? data?.message ?? error.message}
        icon={
          <img alt="not_found" src={status === 404 ? NOTFOUND : QUESTION} />
        }
        extra={[
          <Button
            key="CUSTOMER_SERVICE"
            children={locale.UI.CUSTOMER_SERVICE}
            onClick={() => navigate('/', { replace: true })}
          />,
          <Button
            key="BACK_HOME"
            type="primary"
            children={locale.UI.BACK_HOME}
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
        icon={
          <img
            alt="not_found"
            src={error.status === 404 ? NOTFOUND : QUESTION}
          />
        }
        extra={[
          <Button
            key="CUSTOMER_SERVICE"
            children={locale.UI.CUSTOMER_SERVICE}
            onClick={() => navigate('/', { replace: true })}
          />,
          <Button
            key="BACK_HOME"
            type="primary"
            children={locale.UI.BACK_HOME}
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
          key="CUSTOMER_SERVICE"
          children={locale.UI.CUSTOMER_SERVICE}
          onClick={() => navigate('/', { replace: true })}
        />,
        <Button
          key="BACK_HOME"
          type="primary"
          children={locale.UI.BACK_HOME}
          onClick={() => navigate('/', { replace: true })}
        />,
      ]}
    />
  );
}
