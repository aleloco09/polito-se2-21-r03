import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export function ModalComponent(props) {
  const { ticketId, ewt, onClose } = props;

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Your ticket number</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2 className="text-center pt-5">{ticketId}</h2>
        <h4 className="text-center mt-3 pb-5">Estimated waiting time: {ewt}m</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

}
