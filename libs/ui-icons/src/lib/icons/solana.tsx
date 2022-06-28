import { FC } from 'react';

import { iconProps } from './icons.interface';

const Solana: FC<iconProps> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#F9F9F9" />
    <g clipPath="url(#clip0_2749_9469)">
      <path
        d="M7.27405 15.3956C7.35854 15.3109 7.47471 15.2615 7.59792 15.2615H18.7712C18.9753 15.2615 19.0774 15.5085 18.9331 15.6532L16.7259 17.8659C16.6414 17.9506 16.5252 18 16.402 18H5.22879C5.02462 18 4.92253 17.753 5.06686 17.6083L7.27405 15.3956Z"
        fill="url(#paint0_linear_2749_9469)"
      />
      <path
        d="M7.27393 7.1341C7.36194 7.04941 7.47811 7 7.59779 7H18.771C18.9752 7 19.0773 7.24703 18.933 7.39172L16.7258 9.60443C16.6413 9.68912 16.5251 9.73853 16.4019 9.73853H5.22867C5.0245 9.73853 4.92241 9.4915 5.06674 9.34681L7.27393 7.1341Z"
        fill="url(#paint1_linear_2749_9469)"
      />
      <path
        d="M16.7259 11.2384C16.6414 11.1537 16.5252 11.1042 16.402 11.1042H5.22879C5.02462 11.1042 4.92253 11.3513 5.06686 11.496L7.27405 13.7087C7.35854 13.7934 7.47471 13.8428 7.59792 13.8428H18.7712C18.9753 13.8428 19.0774 13.5957 18.9331 13.4511L16.7259 11.2384Z"
        fill="url(#paint2_linear_2749_9469)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_2749_9469"
        x1="17.7038"
        y1="5.67821"
        x2="9.94066"
        y2="20.5107"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2749_9469"
        x1="14.3225"
        y1="3.90853"
        x2="6.55934"
        y2="18.741"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2749_9469"
        x1="16.0024"
        y1="4.7877"
        x2="8.23929"
        y2="19.6202"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <clipPath id="clip0_2749_9469">
        <rect width="14" height="11" fill="white" transform="translate(5 7)" />
      </clipPath>
    </defs>
  </svg>
);

export default Solana;
