import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CollateralAsset } from '@archie-webapps/shared/constants';
import { ButtonOutline } from '@archie-webapps/shared/ui/design-system';

import { AddNewAssetStyled } from './add-new-asset.styled';

interface AddNewAssetProps {
  assets: CollateralAsset[];
}
export const AddNewAsset: FC<AddNewAssetProps> = ({ assets }) => {
  const [chosenAsset, setChosenAsset] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  return (
    <AddNewAssetStyled>
      <select value={chosenAsset} onChange={(e) => setChosenAsset(e.target.value)}>
        <option value={undefined}>--</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.short}
          </option>
        ))}
      </select>
      <ButtonOutline
        small
        className="add-btn"
        disabled={chosenAsset === undefined}
        onClick={() => navigate(`/collateral/add/${chosenAsset}`)}
      >
        Add
      </ButtonOutline>
    </AddNewAssetStyled>
  );
};
