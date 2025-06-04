import { GeckoI18n, I18nLazyDoc } from '@geckoai/gecko-i18n';

export const locales: I18nLazyDoc[] = [
  {
    lang: 'zh-CN',
    locale: GeckoI18n.loader('/locales/zh.json')
  },
  {
    lang: 'en',
    default: true,
    locale: GeckoI18n.loader('/locales/en.json')
  }
]