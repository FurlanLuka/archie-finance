import { createGlobalStyle } from 'styled-components'

// import fontBlack from '../../../assets/fonts/Inter-Black.ttf'
// import fontExtraBold from '../../../assets/fonts/Inter-ExtraBold.ttf'
// import fontBold from '../../../assets/fonts/Inter-Bold.ttf'
// import fontSemiBold from '../../../assets/fonts/Inter-SemiBold.ttf'
// import fontMedium from '../../../assets/fonts/Inter-Medium.ttf'
// import fontRegular from '../../../assets/fonts/Inter-Regular.ttf'
// import fontLight from '../../..//assets/fonts/Inter-Light.ttf'
// import fontExtraLight from '../../../assets/fonts/Inter-ExtraLight.ttf'
// import fontThin from '../../../assets/fonts/Inter-Thin.ttf'

const FontFace = createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontBlack}); */
    font-style: normal;
    font-weight: 900;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontExtraBold}); */
    font-style: normal;
    font-weight: 800;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontBold}); */
    font-style: normal;
    font-weight: 700;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontSemiBold}); */
    font-style: normal;
    font-weight: 600;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontMedium}); */
    font-style: normal;
    font-weight: 500;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontRegular}); */
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontLight}); */
    font-style: normal;
    font-weight: 300;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontExtraLight}); */
    font-style: normal;
    font-weight: 200;
  }

  @font-face {
    font-family: 'Inter';
    /* src: url($ {fontThin}); */
    font-style: normal;
    font-weight: 100;
  }
`

export default FontFace