import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ButtonOutline, CollateralCurrency } from '@archie-webapps/ui-design-system';
import { collateralAssets } from '@archie-webapps/util-constants';

import { AllocationCellStyled, ActionsCellStyled } from './table-fixtures.styled';

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
    ],
  },
];
