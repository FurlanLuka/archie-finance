import { FC, useState } from 'react';

import { QueryResponse, RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { CardsImage } from '@archie-webapps/shared/data-access/archie-api/rize/api/get-cards-image';
import { useGetCardsImage } from '@archie-webapps/shared/data-access/archie-api/rize/hooks/use-cards-image';
import { Card } from '@archie-webapps/shared/ui/design-system';

import imgCard from '../../assets/card-placeholder.png';
import { RevealCardModal } from '../modals/reveal-card/reveal-card';

import { ArchieCardStyled } from './archie-card.styled';

export const ArchieCard: FC = () => {
  const [revealCardModalOpen, setRevealCardModalOpen] = useState(false);
  const [revealCardData, setRevealCardData] = useState(false);

  const getCardsImageResponse: QueryResponse<CardsImage> = useGetCardsImage();

  if (getCardsImageResponse.state === RequestState.LOADING) {
    return (
      <ArchieCardStyled>
        <Card className="archie-card">
          <div className="skeleton"></div>
        </Card>
      </ArchieCardStyled>
    );
  }

  if (getCardsImageResponse.state === RequestState.ERROR) {
    return <div>Something went wrong :(</div>; // TODO: replace with error state
  }

  if (getCardsImageResponse.state === RequestState.SUCCESS) {
    const cardsImageData = getCardsImageResponse.data;

    return (
      <ArchieCardStyled>
        <Card
          backgroundImage={`data:image/jpeg;base64,${cardsImageData.image}`}
          className="archie-card clickable"
          onClick={() => (revealCardData ? setRevealCardModalOpen(false) : setRevealCardModalOpen(true))}
        >
          {!revealCardData && (
            <>
              <div className="number-overlay">•••• •••• ••••</div>
              <div className="expiry-overlay">••/••</div>
              <div className="cvv-overlay">•••</div>
            </>
          )}
          {/* <div className="card-data">
            <ParagraphS weight={500}>{revealCardData ? '3443 6546 6457 8021' : '•••• •••• •••• 8021'}</ParagraphS>
            <div className="card-data-group">
              <ParagraphS weight={500}>
                <span>EXP</span>
                {revealCardData ? '09/12' : '••/••'}
              </ParagraphS>
              <ParagraphS weight={500}>
                <span>CVV</span>
                {revealCardData ? '675' : '•••'}
              </ParagraphS>
            </div>
          </div>
          <div className="card-status">
            <ParagraphXXS weight={800} color={theme.textLight}>
              Active
            </ParagraphXXS>
          </div> */}
        </Card>
        <RevealCardModal
          isOpen={revealCardModalOpen}
          close={() => setRevealCardModalOpen(false)}
          onConfirm={() => setRevealCardData(true)}
        />
      </ArchieCardStyled>
    );
  }

  return <></>;
};
