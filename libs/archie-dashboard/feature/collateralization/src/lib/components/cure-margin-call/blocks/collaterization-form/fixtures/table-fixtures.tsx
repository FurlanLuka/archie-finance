import { BodyM } from '@archie-webapps/shared/ui/design-system';

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
        Cell: ({ value: { amount, asset } }: any) => (
          <BodyM weight={500} className="">
            {amount} {asset}
          </BodyM>
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
