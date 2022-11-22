export interface LtvTableEntry {
  targetLtv: string | JSX.Element;
  assetToAdd: {
    id: string;
    amount: number;
    asset: string;
  };
  info: {
    text: string;
    color: string;
  };
}
