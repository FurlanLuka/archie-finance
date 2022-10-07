import ReactTooltip from 'react-tooltip';

import { copyToClipboard } from '@archie-webapps/archie-dashboard/utils';
import { BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

export const tableColumns = [
  {
    Header: '',
    id: 'hidden',
    columns: [
      {
        Header: 'Target LTV',
        accessor: 'target_ltv',
      },
      {
        Header: 'ETH to add:',
        accessor: 'asset_to_add',
        Cell: ({ value: { id, amount, asset } }: any) => (
          <>
            <BodyM
              weight={500}
              id={id}
              className="asset-copy"
              data-tip="Click to copy"
              onClick={() => copyToClipboard(id, amount)}
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
        ),
      },
      {
        Header: '',
        accessor: 'info',
        Cell: ({ value: { text, color } }: any) => (
          <BodyM color={color} weight={500} className="align-right">
            {text}
          </BodyM>
        ),
      },
    ],
  },
];
