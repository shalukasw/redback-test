import React, { FC, ReactNode, useState } from 'react';
import { Modal, ModalProps } from 'react-bootstrap';

export interface Props extends ModalProps {
  show: boolean;
  handleClose: () => void;
  children: ReactNode;
  title: string;
  footer?: () => JSX.Element;
  headerClassNames?: string;
  bodyClassNames?: string;
  footerClassNames?: string;
}
const ModalComponent: FC<Props> = ({
  show,
  handleClose,
  children,
  title,
  footer,
  closeButton,
  headerClassNames,
  bodyClassNames,
  footerClassNames,
  ...props
}) => (
  <Modal show={show} onHide={handleClose} centered {...props}>
    <Modal.Header className={headerClassNames} closeButton={closeButton}>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body className={bodyClassNames}>{children}</Modal.Body>
    {footer && (
      <Modal.Footer className={footerClassNames}>
        {footer && footer()}
      </Modal.Footer>
    )}
  </Modal>
);

interface IUseModalReturn {
  show: boolean;
  handleShow: () => void;
  handleClose: () => void;
  ModalComponent: React.FC<Props>;
}
const useModal = (): IUseModalReturn => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return { ModalComponent, handleShow, show, handleClose };
};

export default useModal;
