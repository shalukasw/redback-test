import React, { FC, useEffect, useState } from 'react';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import undoIcon from 'Assets/Icons/undo.svg';
import redoIcon from 'Assets/Icons/redo.svg';
import saveIcon from 'Assets/Icons/save.svg';
import clearIcon from 'Assets/Icons/clear.svg';
import MenuItem from './MenuItem';
import styles from './menu.module.scss';
import { useNotification } from 'App/Features/Common/Presentation/Providers/NotificationProvider';

interface IMenuItem {
  id: number;
  label: string;
  icon: string;
}
const MENU_ITEMS: IMenuItem[] = [
  {
    id: 1,
    label: 'menu.undo',
    icon: undoIcon,
  },
  {
    id: 2,
    label: 'menu.redo',
    icon: redoIcon,
  },
  {
    id: 3,
    label: 'menu.save',
    icon: saveIcon,
  },
  {
    id: 4,
    label: 'menu.clearAll',
    icon: clearIcon,
  },
];

interface Props {
  handlePortSelection: (port: SerialPort | null) => void;
  onPublishButtonClick: () => void;
  save: () => void;
  undo: () => void;
  redo: () => void;
  clearAll: () => void;
}
const Menu: FC<Props> = ({
  handlePortSelection,
  onPublishButtonClick,
  save,
  undo,
  redo,
  clearAll,
}) => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [canPushCode, setCanPushCode] = useState<boolean>(false);
  const [portIsSelected, setIsPortSelected] = useState<boolean>(false);

  function onPortSelection(port: SerialPort) {
    handlePortSelection(port);
    setIsPortSelected(true);
    port.addEventListener('disconnect', function () {
      handlePortSelection(null);
      setIsPortSelected(false);
    });
  }

  useEffect(() => {
    const serial: Serial = (window.navigator as Navigator).serial;
    if (!serial) {
      addNotification(t('common.errors.browserNotSupported'), 'danger');
      return;
    }
    serial.getPorts().then((ports: SerialPort[]) => {
      if (ports.length) {
        onPortSelection(ports[0]);
      }
    });
  }, []);

  useEffect(() => {
    setCanPushCode(portIsSelected);
  }, [portIsSelected]);

  const selectSerialPort = async () => {
    try {
      const serial: Serial = (window.navigator as Navigator).serial;
      if (serial) {
        const port = await serial
          .requestPort
          // {filters: [{ usbVendorId: 29987 }], // todo from board details}
          ();
        onPortSelection(port);
      }
    } catch (err) {
      addNotification(t('menu.serialport.error', 'danger'));
    }
  };

  return (
    <Container
      fluid
      className={`d-flex align-items-center ${styles.toolbar_menu} border border-secondary-subtle border-end-0 border-start-0`}
    >
      <ButtonGroup role="toolbar" aria-label="Toolbar with action buttons">
        {MENU_ITEMS.sort((a, b) => a.id - b.id).map((item) => {
          return (
            <MenuItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              undo={undo}
              redo={redo}
              clearAll={clearAll}
              save={save}
            />
          );
        })}
      </ButtonGroup>
      <Button
        variant="outline-primary"
        className="rounded-pill text-primary ms-auto me-2"
        onClick={selectSerialPort}
      >
        {t('menu.selectSerialPort')}
      </Button>

      <Button
        variant={canPushCode ? 'primary' : 'secondary'}
        className="rounded-pill"
        disabled={canPushCode === false}
        onClick={onPublishButtonClick}
      >
        {t('menu.pushCodeToDevice')}
      </Button>
    </Container>
  );
};

export default Menu;
