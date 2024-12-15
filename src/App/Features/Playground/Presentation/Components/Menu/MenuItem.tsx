import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useTranslation } from 'react-i18next';
import styles from './menuitem.module.scss';

interface Props {
  label: string;
  icon: string;
  save: () => void;
  undo: () => void;
  redo: () => void;
  clearAll: () => void;
}

const MenuItem: FC<Props> = ({ label, icon, save, undo, redo, clearAll }) => {
  const { t } = useTranslation();
  const actionsMapper: Record<string, () => void> = {
    'menu.redo': redo,
    'menu.undo': undo,
    'menu.save': save,
    'menu.clearAll': clearAll,
  };
  const onClick = () => {
    const action = actionsMapper[label];
    if (typeof action === 'function') {
      action();
    }
  };
  return (
    <Button variant="outline-secondary border-0 rounded-0" onClick={onClick}>
      <span
        className={`d-flex flex-column align-items-center justify-content-center fs-6 ${styles.menu_item}`}
      >
        <Image src={icon} className="mr-2" height={25} width={25} alt={label} />
        {t(label)}
      </span>
    </Button>
  );
};

export default MenuItem;
