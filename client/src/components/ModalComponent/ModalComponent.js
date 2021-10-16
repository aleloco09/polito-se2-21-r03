import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export function ModalComponent(props) {
  const { onClose } = props;

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Your ticket number</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2 className="text-center pt-5 pb-5">A33</h2>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

}
