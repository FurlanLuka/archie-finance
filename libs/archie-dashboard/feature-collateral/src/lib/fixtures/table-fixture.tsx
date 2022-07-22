import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AssetPrice } from '@archie-webapps/shared/data-access-archie-api/asset_price/api/get-asset-price';
import { useGetAssetPrice } from '@archie-webapps/shared/data-access-archie-api/asset_price/hooks/use-get-asset-price';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonOutline, CollateralCurrency } from '@archie-webapps/ui-design-system';
import { collateralAssets } from '@archie-webapps/util-constants';

import { AllocationCellStyled, ChangeCellStyled, ActionsCellStyled } from './table-fixtures.styled';

interface CollateralAssetCellProps {
  id: string;
}

const CollateralAssetCell: FC<CollateralAssetCellProps> = ({ id }) => {
  const asset = Object.values(collateralAssets).find((asset) => asset.id === id);

  return <CollateralCurrency icon={asset?.icon} name={asset?.name} short={asset?.id} />;
};

interface ChangeCellProps {
  id: string;
}

const ChangeCell: FC<ChangeCellProps> = ({ id }) => {
  const getAssetPriceResponse: QueryResponse<AssetPrice[]> = useGetAssetPrice();

  const getAssetDailyChange = () => {
    if (getAssetPriceResponse.state === RequestState.SUCCESS) {
      const asset = getAssetPriceResponse.data.find((asset) => asset.asset === id);

      if (asset) {
        return asset.dailyChange;
      }
    }

    return 0;
  };

  const isPositive = getAssetDailyChange() > 0;

  return (
    <ChangeCellStyled isPositive={isPositive}>
      <span>{isPositive ? '↑' : '↓'}</span>
      {Math.abs(getAssetDailyChange()).toFixed(2)}%
    </ChangeCellStyled>
  );
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
        width: 3,
        Cell: ({ value }: any) => {
          return <CollateralAssetCell id={value} />;
        },
      },
      {
        Header: 'Balance',
        accessor: 'balance',
        width: 2,
      },
      {
        Header: 'Holdings',
        accessor: 'holdings',
        width: 2,
      },
      {
        Header: <AllocationCellStyled>Change</AllocationCellStyled>,
        accessor: 'change',
        width: 1,
        Cell: ({ value: { collateral_asset } }: any) => {
          return <ChangeCell id={collateral_asset} />;
        },
      },
      {
        Header: <AllocationCellStyled>Allocation</AllocationCellStyled>,
        accessor: 'allocation',
        width: 1,
        Cell: ({ value }: any) => {
          return <AllocationCellStyled>{value}</AllocationCellStyled>;
        },
      },
      {
        Header: '',
        accessor: 'actions',
        width: 1,
        Cell: ({ value: { collateral_asset } }: any) => {
          return <ActionsCell id={collateral_asset} />;
        },
      },
    ],
  },
];
