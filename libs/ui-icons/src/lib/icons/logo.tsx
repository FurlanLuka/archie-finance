import { FC } from 'react';
import { theme } from '@archie-webapps/ui-theme';

import { iconProps } from './icons.interface';

const Logo: FC<iconProps> = ({ fill = theme.textPrimary, className }) => (
  <svg width="86" height="26" viewBox="0 0 86 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M34.2943 18.2258L33.8174 22.729H30.0957L32.8163 3.875H38.2437L41.0309 22.7344H37.2355L36.7014 18.2312L34.2943 18.2258ZM36.3845 15.0416C36.1095 12.5999 35.7245 8.96566 35.5446 7.13669H35.4005C35.3328 8.46656 34.8763 12.6952 34.6166 15.0427L36.3845 15.0416Z"
      fill={fill}
    />
    <path
      d="M42.0589 12.9028C42.0589 10.3599 42.0693 9.15442 42.0215 7.85309H45.5028C45.5419 8.1546 45.6084 9.40855 45.6084 10.0869C46.1541 8.33389 47.3642 7.63718 48.7668 7.62695V11.9698C47.0023 11.9698 45.7135 12.2896 45.7135 14.8438V22.7288H42.0589V12.9028Z"
      fill={fill}
    />
    <path
      d="M58.6504 17.4721V17.9798C58.6504 20.8054 57.8682 22.9569 54.1399 22.9569C50.5992 22.9569 49.7422 20.8749 49.7422 17.6342V12.5478C49.7422 9.98822 50.7147 7.62891 54.3027 7.62891C58.1916 7.62891 58.6817 10.2133 58.6817 12.2366V12.9619H55.1669V12.0756C55.1669 11.0801 55.0145 10.5299 54.2868 10.5299C53.559 10.5299 53.3891 11.086 53.3891 12.0573V18.5182C53.3891 19.3856 53.542 20.0355 54.2868 20.0355C55.0315 20.0355 55.1669 19.4039 55.1669 18.4143V17.4646L58.6504 17.4721Z"
      fill={fill}
    />
    <path
      d="M63.6275 3.39767V9.01167C64.1517 8.18252 65.0307 7.62634 66.4234 7.62634C68.7507 7.62634 69.4768 9.29541 69.4768 11.4334V22.7282H65.8041V12.3277C65.8041 11.4232 65.6226 10.7534 64.7727 10.7534C63.9229 10.7534 63.6176 11.2541 63.6176 12.6761V22.7282H59.9707V3.03909H63.259C63.307 3.03849 63.3547 3.04728 63.3992 3.06493C63.4441 3.08241 63.4849 3.1086 63.5191 3.14193C63.5537 3.17538 63.581 3.2153 63.5994 3.2593C63.6181 3.30315 63.6276 3.35018 63.6275 3.39767Z"
      fill={fill}
    />
    <path
      d="M70.8457 7.85588H74.4986V22.7311H70.8457V7.85588ZM71.184 3.04249H74.1989C74.2409 3.04245 74.2825 3.05057 74.3213 3.06637C74.3601 3.08217 74.3953 3.10535 74.4249 3.13456C74.485 3.19406 74.5186 3.27437 74.5184 3.358V6.00698C74.5186 6.09061 74.485 6.17092 74.4249 6.23042C74.3954 6.2597 74.3602 6.28296 74.3214 6.29886C74.2826 6.31475 74.2409 6.32297 74.1989 6.32303H71.184C71.1419 6.32297 71.1003 6.31493 71.0613 6.29934C71.0225 6.28325 70.9872 6.26004 70.9574 6.23096C70.9277 6.2014 70.9041 6.16647 70.8881 6.12812C70.872 6.08969 70.8639 6.0485 70.8644 6.00698V3.35854C70.8634 3.3166 70.8709 3.27489 70.8864 3.23578C70.9022 3.19694 70.9256 3.16147 70.9552 3.13133C70.9849 3.10143 71.0205 3.07768 71.0598 3.0615C71.0991 3.04531 71.1413 3.03702 71.184 3.03711V3.04249Z"
      fill={fill}
    />
    <path
      d="M79.348 16.2189V18.386C79.348 19.3471 79.5773 20.0551 80.4184 20.0551C81.3243 20.0551 81.4767 19.2911 81.4767 18.3402V18.0172H85.0163V18.2191C85.0163 20.1875 84.4156 22.9657 80.4371 22.9657C76.5482 22.9657 75.7324 20.7803 75.7324 17.7286V12.7052C75.7324 10.2878 76.849 7.62695 80.4459 7.62695C83.6247 7.62695 85.0664 9.51139 85.0664 12.688V16.2205L79.348 16.2189ZM81.5449 13.648V12.1889C81.5449 11.0302 81.2869 10.5026 80.4657 10.5026C79.7583 10.5026 79.3656 11.0017 79.3656 12.1889V13.648H81.5449Z"
      fill={fill}
    />
    <path
      d="M12.2156 0.785156C5.46891 0.785156 0 6.25407 0 13.0007C0 19.7474 5.46891 25.2163 12.2156 25.2163C18.9622 25.2163 24.4311 19.7474 24.4311 13.0007C24.4311 6.25407 18.9622 0.785156 12.2156 0.785156ZM18.0027 18.7879C16.6637 20.1267 14.902 20.9599 13.0176 21.1455C11.1332 21.331 9.24273 20.8575 7.66836 19.8054C6.09399 18.7534 4.9331 17.188 4.38349 15.376C3.83388 13.564 3.92956 11.6175 4.65423 9.86817C5.3789 8.11882 6.68772 6.67485 8.35768 5.7823C10.0276 4.88976 11.9554 4.60386 13.8125 4.97332C15.6696 5.34279 17.3412 6.34476 18.5424 7.80851C19.7436 9.27225 20.4001 11.1072 20.4 13.0007C20.4029 14.0759 20.1925 15.1411 19.781 16.1344C19.3695 17.1278 18.7651 18.0297 18.0027 18.7879ZM6.8963 13.0007L8.97295 10.9241H15.4588L17.5354 13.0007L12.2156 18.32L6.8963 13.0007Z"
      fill={fill}
    />
  </svg>
);

export default Logo;
