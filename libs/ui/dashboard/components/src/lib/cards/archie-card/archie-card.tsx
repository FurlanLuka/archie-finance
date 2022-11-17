import { FC, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { CardStatusColor, CardStatusText } from '@archie/ui/shared/constants';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetCardsCredit } from '@archie/ui/shared/data-access/archie-api/rize/hooks/use-cards-credit';
import { Card, Skeleton, BodyL, BodyS } from '@archie/ui/shared/design-system';

import imgCard from '../../assets/card-placeholder.png';
import { RevealCardModal } from '../../modals/reveal-card/reveal-card';

import { ArchieCardStyled } from './archie-card.styled';
import { StatusBadge } from './blocks/status-badge/status-badge';

export const ArchieCard: FC = () => {
  const [revealCardModalOpen, setRevealCardModalOpen] = useState(false);
  const [revealCardData, setRevealCardData] = useState(false);

  const getCardsCreditResponse = useGetCardsCredit();

  if (getCardsCreditResponse.state === RequestState.LOADING) {
    return (
      <ArchieCardStyled>
        <Card className="archie-card">
          <Skeleton />
        </Card>
      </ArchieCardStyled>
    );
  }

  if (getCardsCreditResponse.state === RequestState.ERROR) {
    return <Navigate to="/error" state={{ prevPath: '/home' }} />;
  }

  if (getCardsCreditResponse.state === RequestState.SUCCESS) {
    const cardsCreditData = getCardsCreditResponse.data;

    return (
      <ArchieCardStyled>
        <Card
          className="archie-card clickable"
          backgroundImage={`data:image/jpeg;base64,${cardsCreditData.image}`}
          onClick={() =>
            revealCardData
              ? setRevealCardModalOpen(false)
              : setRevealCardModalOpen(true)
          }
        >
          {/* Temp, just for Rize */}
          {!revealCardData && (
            <>
              <div className="number-overlay">•••• •••• ••••</div>
              <div className="expiry-overlay">••/••</div>
              <div className="cvv-overlay">•••</div>
            </>
          )}
          <StatusBadge status={cardsCreditData.status} />
          {/* <div className="card-data">
            <BodyL weight={500}>{revealCardData ? '3443 6546 6457 8021' : '•••• •••• •••• 8021'}</BodyL>
            <div className="card-data-group">
              <BodyL weight={500}>
                <span>EXP</span>
                {revealCardData ? '09/12' : '••/••'}
              </BodyL>
              <BodyL weight={500}>
                <span>CVV</span>
                {revealCardData ? '675' : '•••'}
              </BodyL>
            </div>
          </div>
          <div className="card-status">
            <BodyS weight={800} color={theme.textLight}>
              Active
            </BodyS>
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
