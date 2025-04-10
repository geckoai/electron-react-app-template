import { createContext, createElement, PropsWithChildren } from 'react';
import I18n from '@geckoai/i18n';
import { i18n } from './index';
import { ConfigProvider } from '@packages/components';

const localeData = i18n.localeData();

export const I18nContext = createContext(localeData);

export function I18nProvider(props: PropsWithChildren<{}>) {
  const current = I18n.current(localeData);
  return createElement(I18nContext.Provider, {
    value: current,
    children: createElement(ConfigProvider, {
      locale: current.ANTD,
      ...props,
    }),
  });
}
