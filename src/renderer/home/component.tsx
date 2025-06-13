import { I18nGlobalService, I18nLocale, useI18n } from '@geckoai/i18n-react';
import { useService } from '@geckoai/platform-react';

export const Component = () => {
  const service = useService<I18nGlobalService>(I18nGlobalService);
  const i18n = useI18n<I18nLocale>();
  return (
    <div>
      {i18n?.Home}
      <div>
        <button type="button" onClick={() => service.current.next('zh_CN')}>
          中文
        </button>
        <button type="button" onClick={() => service.current.next('en')}>
          English
        </button>
      </div>
    </div>
  );
};
