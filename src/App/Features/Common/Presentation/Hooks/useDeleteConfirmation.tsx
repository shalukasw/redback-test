import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useModal from './useModal';

interface IDeleteConfirmation {
  confirmation: () => void;
  Modal: React.FC;
}

const useDeleteConfirmation = (
  title: string,
  callback: () => void,
  description: string | null,
): IDeleteConfirmation => {
  const { t } = useTranslation();
  const { ModalComponent, handleShow, show, handleClose } = useModal();

  const handleConfirmation = () => {
    handleClose();
    callback();
  };

  const renderFooter = () => {
    return (
      <>
        <Button variant="light" onClick={handleClose}>
          {t('common.labels.cancel')}
        </Button>
        <Button variant="primary" onClick={handleConfirmation}>
          {t('common.labels.yes')}
        </Button>
      </>
    );
  };

  return {
    confirmation: handleShow,
    Modal: () => (
      <ModalComponent
        show={show}
        handleClose={handleClose}
        title={title}
        footer={renderFooter}
      >
        {description && <p>{description}</p>}
      </ModalComponent>
    ),
  };
};

export default useDeleteConfirmation;
