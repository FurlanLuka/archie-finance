import { createGlobalStyle, keyframes } from 'styled-components';

import { breakpoints } from './breakpoints';

const scale = keyframes`
  0% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    word-wrap: break-word;
  }

  html {
    min-height: 100%;
  }

  html,
  body {
    font-size: 16px;
    font-style: normal;
    font-stretch: normal;
    font-family: 'Inter';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    -webkit-overflow-scrolling: touch;
  }

  ul,
  menu,
  dir {
    padding-left: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }

  *:focus,
  *:active {
    outline: 0 !important;
  }
  
  a,
  button {
   transition: opacity .3s;
   outline: none;
  }

  .no-scroll {
    overflow: hidden !important;
  }

  .hide-lg {
    @media (min-width: ${breakpoints.screenMD}) {
      display: none !important;
    }
  }  

  .hide-sm {
    @media (max-width: ${breakpoints.screenMD}) {
      display: none !important;
    }
  }

  .clickable {
    cursor: pointer;
  }

  .copied {
    transform-origin: center;
    animation: ${scale} 0.2s ease forwards, ${fadeOut} 0.8s ease forwards;
  }

  ::-moz-selection { 
    color: #fff;
    background: #ff8577;
  }

  ::selection {
    color: #fff;
    background: #ff8577;
  }


  img {
    max-width: 100%;
  }
`;
