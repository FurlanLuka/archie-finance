import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { CollateralAssets } from '@archie-webapps/shared/constants';
import { AssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/api/get-asset-price';
import { useGetAssetPrice } from '@archie-webapps/shared/data-access/archie-api/asset_price/hooks/use-get-asset-price';
import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonOutline, CollateralCurrency } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { AllocationCellStyled, ChangeCellStyled, ActionsCellStyled } from './table-fixtures.styled';

interface CollateralAssetCellProps {
  id: string;
}

const CollateralAssetCell: FC<CollateralAssetCellProps> = ({ id }) => {
  const asset = CollateralAssets[id];

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

interface AllocationCellProps {
  value: number;
}

const AllocationCell: FC<AllocationCellProps> = ({ value }) => (
  <AllocationCellStyled>
    <span data-tip={`${value}%`}>{value.toFixed(2)}%</span>
    <ReactTooltip
      textColor={theme.tooltipText}
      backgroundColor={theme.tooltipBackground}
      effect="solid"
      delayHide={1000}
    />
  </AllocationCellStyled>
);

interface ActionsCellProps {
  id: string;
}

const ActionsCell: FC<ActionsCellProps> = ({ id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ActionsCellStyled>
      <ButtonOutline small color={theme.textPositive} onClick={() => navigate(`add/${id}`)}>
        {t('btn_add')}
      </ButtonOutline>
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
          return <AllocationCell value={value} />;
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
