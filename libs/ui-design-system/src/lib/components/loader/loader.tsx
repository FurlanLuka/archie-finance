import { FC } from 'react';

import { LoaderStyled } from './loader.styled';

interface LoaderProps {
  className?: string;
  color?: string;
}
export const Loader: FC<LoaderProps> = ({ color, className }) => (
  <LoaderStyled className={className} color={color}>
    <div className="rect rect1"></div>
    <div className="rect rect2"></div>
    <div className="rect rect3"></div>
    <div className="rect rect4"></div>
    <div className="rect rect5"></div>
  </LoaderStyled>
);
