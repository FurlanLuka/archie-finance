import { FC } from 'react';

import { LoaderStyled } from './loader.styled';

export interface LoaderProps {
  className?: string;
  color?: string;
  marginAuto?: boolean;
}

export const Loader: FC<LoaderProps> = ({ color, className, marginAuto }) => (
  <LoaderStyled className={className} color={color} marginAuto={marginAuto}>
    <div className="rect rect1"></div>
    <div className="rect rect2"></div>
    <div className="rect rect3"></div>
    <div className="rect rect4"></div>
    <div className="rect rect5"></div>
  </LoaderStyled>
);