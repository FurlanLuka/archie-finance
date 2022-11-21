export interface TableDataEntry {
  date: string;
  description: {
    title: string;
    code: string;
  };
  status: string;
  amount: string;
}

export const tableData: TableDataEntry[] = [
  {
    date: 'Yesterday',
    description: {
      title: 'Merchant Name',
      code: 'Merchant code',
    },
    status: 'pending',
    amount: '$22.31',
  },
  {
    date: '5/3',
    description: {
      title: 'SquareSpace',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$16.00',
  },
  {
    date: '5/2',
    description: {
      title: 'TST*TST Annie Baileys Lancaster',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$118.01',
  },
  {
    date: '5/1',
    description: {
      title: 'TST* Zoetropolis Cinema Lancaster PA',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$22.31',
  },
  {
    date: '4/30',
    description: {
      title: 'Sunoco 0363427601',
      code: 'Merchant code',
    },
    status: 'completed',
    amount: '$104.28',
  },
];
