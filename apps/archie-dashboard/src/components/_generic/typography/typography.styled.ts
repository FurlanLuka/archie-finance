import styled from 'styled-components'

import breakpoints from '../../../constants/breakpoints'

interface TypographyProps {
  color?: string;
  weight?: number;
}

export const Headline = styled.h1<TypographyProps>` 
  font-size: 5rem; //80
  line-height: 1.1;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 900};

  @media (max-width: ${breakpoints.screenLG}) {
    font-size: 4rem; //64
  }

  @media (max-width: ${breakpoints.screenMD}) {
    font-size: 2rem; //32
  }
`

export const Title = styled.h2<TypographyProps>` 
  font-size: 4.5rem; //72 
  line-height: 1.1;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 900};

  @media (max-width: ${breakpoints.screenLG}) {
    font-size: 3rem; //48
  }

  @media (max-width: ${breakpoints.screenMD}) {
    font-size: 2rem; //32
  }
`

export const SubtitleL = styled.h3<TypographyProps>` 
  font-size: 3rem; //48
  line-height: 1.1;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 800};

  @media (max-width: ${breakpoints.screenLG}) {
    font-size: 2rem; //32
  }
`

export const SubtitleM = styled.h4<TypographyProps>`  
  font-size: 2.5rem; //40
  line-height: 1.2;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 800};

  @media (max-width: ${breakpoints.screenMD}) {
    font-size: 2rem; //32
  }
`

export const SubtitleS = styled.h4<TypographyProps>`  
  font-size: 2rem; //32
  line-height: 1.2;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 800};

  @media (max-width: ${breakpoints.screenMD}) {
    font-size: 1.5rem; //24
  }
`

export const ParagraphM = styled.p<TypographyProps>` 
  font-size: 1.5rem; //24
  line-height: 1.3;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 400};

  @media (max-width: ${breakpoints.screenLG}) {
    font-size: 1rem; //16
    line-height: 1.5;
  }
`

export const ParagraphS = styled.p<TypographyProps>` 
  font-size: 1rem; //16
  line-height: 1.5;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 400};

  @media (max-width: ${breakpoints.screenLG}) {
    font-size: 0.875rem; //14
  }
`

export const ParagraphXS = styled.p<TypographyProps>` 
  font-size: 0.875rem; //14
  line-height: 1.5;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 400};
`

export const ParagraphXXS = styled.p<TypographyProps>` 
  font-size: 0.75rem; //12
  line-height: 1.5;
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  font-weight: ${({ weight }) => weight ?? 400};
`