import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Select, SelectOption, TitleS, BodyM } from '@archie-webapps/shared/ui/design-system';

import { AutopayModalStyled } from './autopay.styled';

interface AutopayModalProps {
  close: () => void;
}

export const AutopayModal: FC<AutopayModalProps> = ({ close }) => {
  const { t } = useTranslation();

  const [selectedFrequecnyItem, setSelectedFrequencyItem] = useState<string | null>(null);

  const header = selectedFrequecnyItem ? (
    <BodyM>{selectedFrequecnyItem}</BodyM>
  ) : (
    <BodyM weight={500}>Select frequency</BodyM>
  );

  const selectOptions = ['On due dates', 'Once a period'];

  const options = selectOptions.map((item, index) => (
    <SelectOption key={index} value={item}>
      <BodyM weight={500}>{item}</BodyM>
    </SelectOption>
  ));

  return (
    <Modal maxWidth="780px" isOpen close={close}>
      <AutopayModalStyled>
        <TitleS className="title">{t('autopay_modal.title')}</TitleS>
        <BodyM weight={600}>Payments are automatically scheduled on each period's due date.</BodyM>
        <BodyM>Payment will be the full statement balance of each period.</BodyM>
        <div className="divider" />
      </AutopayModalStyled>
    </Modal>
  );
};
