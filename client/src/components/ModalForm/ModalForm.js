import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export function ModalForm(props) {
  const { onClose, onSave } = props;
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseCredits, setCourseCredits] = useState('');
  const [color, setColor] = useState('black');

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setValidated(true); // bootstrap validation error report
    } else {

      const newSG = Object.assign({}, { courseCode, courseCredits, courseName, color, });
      onSave(newSG);
    }
  }

  return (
    <Modal className="NewMemeModal" show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Study Group</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="form-text-title">
            <Form.Label>Course Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter course name" value={courseName}
              onChange={(ev) => setCourseName(ev.target.value)} required autoFocus />
            <Form.Control.Feedback type="invalid">
              Please provide a course name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="form-code">
            <Form.Label>Course Code</Form.Label>
            <Form.Control type="text" name="code" placeholder="Enter course code" value={courseCode}
              onChange={(ev) => setCourseCode(ev.target.value)} required autoFocus />
            <Form.Control.Feedback type="invalid">
              Please provide a course code.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="form-credits">
            <Form.Label>Course Credits</Form.Label>
            <Form.Control type="number" name="code" value={courseCredits}
              onChange={(ev) => setCourseCredits(ev.target.value)} required autoFocus />
            <Form.Control.Feedback type="invalid">
              Please provide a course credits.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="form-color">
            <Form.Label>Color</Form.Label>
            <Form.Control name="color" as="select" value={color}
              onChange={(ev) => setColor(ev.target.value)} required autoFocus >
              <option key={1}>black</option>
              <option key={2}>red</option>
              <option key={3}>green</option>
              <option key={4}>blue</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide a color.
            </Form.Control.Feedback>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )

}
