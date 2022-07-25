import { FC } from 'react';

import { LoaderStyled } from './loader.styled';

interface LoaderProps {
  className?: string;
}
export const Loader: FC<LoaderProps> = ({ className }) => (
  <LoaderStyled className={className}>
    <div className="rect rect1"></div>
    <div className="rect rect2"></div>
    <div className="rect rect3"></div>
    <div className="rect rect4"></div>
    <div className="rect rect5"></div>
  </LoaderStyled>
);
