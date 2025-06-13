import { I18nLazyDoc, I18nReact } from '@geckoai/i18n-react';

// You can load language packs in the following two ways
// 1. Use public static json file
export const locales: I18nLazyDoc[] = [
  {
    // Language key of browser `window.navigator.language`
    // Please follow the browser language settings
    lang: 'zh-CN',
    locale: I18nReact.loader('/locales/zh.json'),
  },
  {
    // Language key of browser `window.navigator.language`
    // Please follow the browser language settings
    lang: 'en',
    locale: I18nReact.loader('/locales/en.json'),
  },
];

// // 2. Use location json
// export const locales: I18nLazyDoc[] = [
//   {
//     // Language key of browser `window.navigator.language`
//     // Please follow the browser language settings
//     lang: 'zh-CN',
//     locale: {
//       Home: '首页',
//       User: '用户',
//     },
//   },
//   {
//     // Language key of browser `window.navigator.language`
//     // Please follow the browser language settings
//     lang: 'en',
//     locale: {
//       Home: 'Home',
//       User: 'User',
//     },
//   },
// ];
