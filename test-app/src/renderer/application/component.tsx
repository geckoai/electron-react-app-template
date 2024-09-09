import { Layout } from '@packages/components';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import i18n from '@packages/i18n';
import { ApplicationStoreState } from './application.store';
import { I18nProvider } from '@packages/i18n';

//sads

// rem 方案代码
// import { StyleProvider, px2remTransformer } from '@ant-design/cssinjs';
// const px2rem = px2remTransformer({
//   rootValue: 12,
// });

export const Component = () => {
  const { locale } = useRecoilValue(ApplicationStoreState);
  useEffect(() => {
    i18n.locale(locale);
  }, [locale]);
  return (
    <I18nProvider>
      <Layout
        style={{
          width: '100vw',
          minHeight: '100vh',
          overflow: 'hidden',
          minWidth: 1200,
        }}
      >
        <Outlet />
      </Layout>
    </I18nProvider>

    // rem 方案代码
    // <StyleProvider transformers={[px2rem]}>
    //   <I18nProvider>
    //     <Layout style={{ width: '100vw', minHeight: '100vh' }}>
    //       <Outlet />
    //     </Layout>
    //   </I18nProvider>
    // </StyleProvider>
  );
};
