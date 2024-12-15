import React from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function LoginGameError({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  return (
    <>
      <style type="text/css">
        {`
.modal-content{
height:60vh;
border: 10px solid #ff8000;
    border-radius: 10px;
}
 
    `}
      </style>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        size="lg"
        dialogClassName="modal-60w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="mx-auto d-flex align-items-center">
          <Container className=" d-flex flex-column">
            <div className="pb-5">Uh oh, that wasn’t the right one</div>
            <Button
              variant="primary"
              onClick={handleClose}
              className="btn btn-primary btn-lg"
            >
              Try Again
            </Button>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
