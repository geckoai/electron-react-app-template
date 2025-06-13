import { StrictMode } from 'react';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import { Container } from '@geckoai/gecko-core';
import { Router } from '@geckoai/platform-react';

export function Root({ router }: RootProps) {
  return (
    <StrictMode>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </StrictMode>
  );
}

export interface RootProps {
  // 依赖注入容器
  container: Container;
  // 路由
  router: Router;
}
