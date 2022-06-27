import styles from './ui-design-system.module.css';

/* eslint-disable-next-line */
export interface UiDesignSystemProps {}

export function UiDesignSystem(props: UiDesignSystemProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to UiDesignSystem!</h1>
    </div>
  );
}

export default UiDesignSystem;
