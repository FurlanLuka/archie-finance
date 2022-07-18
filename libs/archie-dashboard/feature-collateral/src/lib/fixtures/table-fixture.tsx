import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ButtonOutline, CollateralCurrency } from '@archie-webapps/ui-design-system';
import { Icon } from '@archie-webapps/ui-icons';
import { collateralAssets } from '@archie-webapps/util-constants';

import { AllocationCellStyled, ActionsCellStyled, OptionsCellStyled } from './table-fixtures.styled';

interface CollateralAssetCellProps {
  id: string;
}

const CollateralAssetCell: FC<CollateralAssetCellProps> = ({ id }) => {
  const asset = collateralAssets.find((asset) => asset.id === id);

  return <CollateralCurrency icon={asset?.icon} name={asset?.name} short={asset?.id} />;
};

interface ActionsCellProps {
  id: string;
}

const ActionsCell: FC<ActionsCellProps> = ({ id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ActionsCellStyled>
      <ButtonOutline small>{t('btn_add')}</ButtonOutline>
      <ButtonOutline small onClick={() => navigate(`withdraw/${id}`)}>
        {t('btn_claim')}
      </ButtonOutline>
    </ActionsCellStyled>
  );
};

const OptionsCell: FC = () => (
  <OptionsCellStyled>
    <Icon name="options-dots" />
  </OptionsCellStyled>
);

export const tableColumns = [
  {
    Header: '',
    id: 'hidden',
    columns: [
      {
        Header: '',
        accessor: 'collateral_asset',
        width: 2,
        Cell: ({ value }: any) => {
          return <CollateralAssetCell id={value} />;
        },
      },
      {
        Header: 'Balance',
        accessor: 'balance',
        width: 3,
      },
      {
        Header: 'Holdings',
        accessor: 'holdings',
        width: 3,
      },
      {
        Header: 'Allocation',
        accessor: 'allocation',
        width: 3,
        Cell: ({ value }: any) => {
          return <AllocationCellStyled>{value}</AllocationCellStyled>;
        },
      },
      {
        Header: '',
        accessor: 'actions',
        width: 3,
        Cell: ({ value: { collateral_asset } }: any) => {
          return <ActionsCell id={collateral_asset} />;
        },
      },
      {
        Header: '',
        accessor: 'options',
        width: 1,
        Cell: () => {
          return <OptionsCell />;
        },
      },
    ],
  },
];
