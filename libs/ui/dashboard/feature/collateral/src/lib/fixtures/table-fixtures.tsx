import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { CollateralAssets } from '@archie/ui/shared/constants';
import { useGetAssetPrice } from '@archie/ui/shared/data-access/archie-api/asset_price/hooks/use-get-asset-price';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import {
  ButtonOutline,
  CollateralCurrency,
} from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { AssetValue } from './table-fixtures.interfaces';
import {
  AlignCenterCellStyled,
  ChangeCellStyled,
  ActionsCellStyled,
} from './table-fixtures.styled';

interface CollateralAssetCellProps {
  id: string;
}

const CollateralAssetCell: FC<CollateralAssetCellProps> = ({ id }) => {
  const asset = CollateralAssets[id];

  return (
    <CollateralCurrency
      icon={asset?.icon}
      name={asset?.name}
      short={asset?.id}
    />
  );
};

interface ChangeCellProps {
  id: string;
}

const ChangeCell: FC<ChangeCellProps> = ({ id }) => {
  const getAssetPriceResponse = useGetAssetPrice();

  const getAssetDailyChange = () => {
    if (getAssetPriceResponse.state === RequestState.SUCCESS) {
      const asset = getAssetPriceResponse.data.find(
        (asset) => asset.assetId === id,
      );

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
  <AlignCenterCellStyled>
    <span data-tip={`${value}%`}>{value.toFixed(2)}%</span>
    <ReactTooltip
      textColor={theme.tooltipText}
      backgroundColor={theme.tooltipBackground}
      effect="solid"
      delayHide={1000}
    />
  </AlignCenterCellStyled>
);

interface ActionsCellProps {
  id: string;
  canClaim: boolean;
}

const ActionsCell: FC<ActionsCellProps> = ({ canClaim, id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ActionsCellStyled>
      <ButtonOutline
        small
        width="100%"
        color={theme.textPositive}
        onClick={() => navigate(`add/${id}`)}
      >
        {t('btn_add')}
      </ButtonOutline>
      <ButtonOutline
        small
        width="100%"
        isDisabled={!canClaim}
        onClick={() => navigate(`withdraw/${id}`)}
      >
        {t('btn_claim')}
      </ButtonOutline>
    </ActionsCellStyled>
  );
};

const columnHelper = createColumnHelper<AssetValue>();

export const tableColumns: ColumnDef<AssetValue, any>[] = [
  columnHelper.accessor('collateralAsset', {
    header: '',
    cell: ({ getValue }) => {
      return <CollateralAssetCell id={getValue()} />;
    },
  }),
  columnHelper.accessor('balance', {
    header: 'Balance',
    cell: ({ renderValue }) => renderValue(),
  }),
  columnHelper.accessor('holdings', {
    header: 'Holdings',
    cell: ({ renderValue }) => renderValue(),
  }),
  columnHelper.accessor('allocation', {
    header: () => (
      <AlignCenterCellStyled>Allocation Percentage</AlignCenterCellStyled>
    ),
    cell: ({ getValue }) => {
      return <AllocationCell value={getValue()} />;
    },
  }),
  columnHelper.accessor('change', {
    header: () => <AlignCenterCellStyled>Change</AlignCenterCellStyled>,
    cell: ({ getValue }) => {
      const { collateralAsset } = getValue();

      return <ChangeCell id={collateralAsset} />;
    },
  }),
  columnHelper.accessor('actions', {
    header: '',
    cell: ({ getValue }) => {
      const { collateralAsset, isHolding, isInMarginCall } = getValue();

      return (
        <ActionsCell
          id={collateralAsset}
          canClaim={isHolding && !isInMarginCall}
        />
      );
    },
  }),
];
