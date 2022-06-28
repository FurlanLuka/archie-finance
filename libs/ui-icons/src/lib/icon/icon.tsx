import { FC, useEffect, useState } from 'react';

export type IconName =
  | 'arrow-indicator-right'
  | 'arrow-right'
  | 'bitcoin-outline'
  | 'bitcoin'
  | 'caret'
  | 'close'
  | 'copy'
  | 'ethereum'
  | 'external-link'
  | 'indicator-active'
  | 'indicator-done'
  | 'logo'
  | 'logout'
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
  const [iconModule, setIconModule] = useState<any>();

  useEffect(() => {
    import(`../icons/${name}.tsx` /* webpackMode: "eager" */)
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

    const Component = iconModule.default;

    return <Component fill={fill} className={className} />;
  };

  return renderIcon();
};
