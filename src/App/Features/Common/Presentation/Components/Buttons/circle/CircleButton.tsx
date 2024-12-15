import React, { FC, ReactNode, forwardRef } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import styles from './circle-button.module.scss';

interface Props extends ButtonProps {
  label: string;
  className?: string | undefined;
  children?: ReactNode;
}

const CircleButton: FC<Props> = forwardRef<HTMLButtonElement, Props>(
  ({ label, className, children, ...props }, ref) => {
    return (
      <Button
        variant="outline-secondary"
        className={`circle-button  d-flex align-items-center  ${className} ${styles.btn_with_left_icon}`}
        {...props}
        ref={ref}
      >
        {children}
        <div className={styles.label}>{label}</div>
      </Button>
    );
  },
);

CircleButton.displayName = 'CircleButton';

export default CircleButton;
