import { FC, useEffect, useState } from 'react';

import { theme } from '@archie-webapps/shared/ui/theme';

export type IconName =
  | 'arrow-indicator-right'
  | 'arrow-right'
  | 'bitcoin-outline'
  | 'bitcoin'
  | 'calendar'
  | 'caret'
  | 'close'
  | 'copy'
  | 'credit-card'
  | 'download'
  | 'ethereum'
  | 'external-link'
  | 'home'
  | 'indicator-active'
  | 'indicator-done'
  | 'logo'
  | 'logout'
  | 'options-dots'
  | 'paper'
  | 'settings'
  | 'solana'
  | 'usdcoin'
  | 'wallet';

interface IconProps {
  className?: string;
  fill?: string;
  name: IconName;
}

export const Icon: FC<IconProps> = ({ name, className, fill }) => {
  const [iconModule, setIconModule] = useState<typeof import('*.svg')>();

  useEffect(() => {
    import(`../../assets/${name}.svg` /* webpackMode: "eager" */)
      .then((module) => {
        setIconModule(module);
      })
      .catch(() => {
        return null;
      });
  }, [name]);

  const renderIcon = () => {
    if (!iconModule) {
      return <span>□</span>;
    }

    const Component = iconModule.ReactComponent;

    return <Component color={fill ?? theme.textPrimary} className={className} />;
  };

  return renderIcon();
};
