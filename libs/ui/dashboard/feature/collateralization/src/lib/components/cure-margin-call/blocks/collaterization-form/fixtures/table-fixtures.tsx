import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import ReactTooltip from 'react-tooltip';

import { copyToClipboard } from '@archie/ui/dashboard/utils';
import { BodyM } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { LtvTableEntry } from '../interfaces';

const columnHelper = createColumnHelper<LtvTableEntry>();

export const tableColumns = (
  currentAsset: string,
): ColumnDef<LtvTableEntry, any>[] => [
  columnHelper.accessor('targetLtv', {
    header: 'Target LTV',
    cell: ({ renderValue }) => renderValue(),
  }),
  columnHelper.accessor('assetToAdd', {
    header: `${currentAsset} to add:`,
    cell: ({ getValue }) => {
      const { id, amount, asset } = getValue();

      return (
        <>
          <BodyM
            weight={500}
            id={id}
            className="asset-copy"
            data-tip="Click to copy"
            onClick={() => copyToClipboard(id, amount.toString())}
          >
            {amount} {asset}
          </BodyM>
          <ReactTooltip
            textColor={theme.tooltipText}
            backgroundColor={theme.tooltipBackground}
            effect="solid"
            delayHide={1000}
          />
        </>
      );
    },
  }),
];
