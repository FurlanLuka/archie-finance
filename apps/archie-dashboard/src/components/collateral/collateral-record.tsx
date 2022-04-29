interface CollateralRecordProps {
  assetName: string;
  amount: number;
}

export const CollateralRecord: React.FC<CollateralRecordProps> = ({
  assetName,
  amount,
}) => {
  return (
    <div className="collateral-record">
      <span className="collateral-record__asset-name">{assetName}</span>
      <span className="collateral-record__asset-amount">{amount}</span>
    </div>
  );
};
