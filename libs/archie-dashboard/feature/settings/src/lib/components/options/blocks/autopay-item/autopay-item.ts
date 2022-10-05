import { FC } from 'react';

export const AutopayItem: FC = () => {
  const { t } = useTranslation();
  const [autopayModalOpen, setAutopayModalOpen] = useState(false);

  return (
    <OptionsItem
      title={t('dashboard_settings.autopay.title')}
      subtitle={t('dashboard_settings.autopay.subtitle', { autopay })}
      onClick={() => setAutopayModalOpen(true)}
    />
  );
};
