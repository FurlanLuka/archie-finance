export const tableColumns = [
  {
    Header: '',
    id: 'hidden',
    columns: [
      {
        Header: 'Date',
        accessor: 'date',
        width: 1,
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 2,
        Cell: ({ value: { title, code } }: any) => {
          return (
            <div>
              <p>{title}</p>
              <p>{code}</p>
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 1,
        Cell: ({ value }: any) => {
          return <div style={{ color: 'grey' }}>{value}</div>;
        },
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        width: 1,
      },
    ],
  },
];
