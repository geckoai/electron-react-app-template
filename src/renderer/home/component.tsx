import { I18nService, useI18n } from '@geckoai/gecko-i18n';
import { useService } from '@geckoai/gecko-router';

export const Component = () => {
  const i18n = useI18n();

  const service = useService<I18nService>(I18nService);

  const [, setState] = service.vm.asState();

  return (
    <div>
      {i18n?.Home}
      <div>
        <button type="button" onClick={() => setState('zh-CN')}>
          中文
        </button>
        <button type="button" onClick={() => setState('en')}>
          English
        </button>
      </div>
    </div>
  );
};
