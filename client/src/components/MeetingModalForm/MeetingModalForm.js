import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import dayjs from 'dayjs';

export function MeetingModalForm(props) {
  const { onClose, onSave } = props;

  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');

  // enables / disables react-bootstrap validation report
  const [validated, setValidated] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleSubmit = (event) => {
    // stop event default and propagation
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    // check if form is valid using HTML constraints
    if (!form.checkValidity()) {
      setValidated(true); // enables bootstrap validation error report
    } else {
      let tmp;
      if (meetingDate !== "" && meetingTime !== "") {
        tmp = dayjs(meetingDate + "T" + meetingTime);
      }
      else if (meetingDate !== "") {
        tmp = dayjs(meetingDate + "T12:00");
      }

      // Check if meeting date and time is allowed
      if (tmp.isBefore(dayjs())) {
        setDateError(true);
      } else {
        setDateError(false);
        const newMeeting = Object.assign({}, { meetingDate: meetingDate, meetingTime: meetingTime, meetingDuration: meetingDuration, meetingLocation: meetingLocation });
        onSave(newMeeting);
      }
    }
  }

  const handleMeetingDate = (ev) => {
    // if date is inserted, set time to noon
    // if date is cacelled, cancel time too
    setMeetingDate(ev.target.value);
    if (ev.target.value !== "") {
      if (meetingTime === "") setMeetingTime("12:00");
    } else {
      setMeetingTime("");
    }
  }

  const handleMeetingTime = (ev) => {
    // if time is inserted, set date to today
    // if time is cacelled, cancel date too
    setMeetingTime(ev.target.value);
    if (ev.target.value !== "") {
      if (meetingDate === "") setMeetingDate(dayjs().format('YYYY-MM-DD'));
    } else {
      setMeetingDate("");
    }
  }

  const handleMeetingDuration = (ev) => {
    setMeetingDuration(ev.target.value);
  }

  const handleMeetingLocation = (ev) => {
    setMeetingLocation(ev.target.value);
  }

  return (
    <Modal className="NewMemeModal" show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Meeting</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="form-meeting-date">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="meetingDate" value={meetingDate} onChange={handleMeetingDate} isInvalid={dateError} />
            <Form.Control.Feedback type="invalid">
              Please provide a valid date and time.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="form-meeting-time">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" name="meetingTime" value={meetingTime} onChange={handleMeetingTime} isInvalid={dateError} />
            <Form.Control.Feedback type="invalid">
              Please provide a valid date and time.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="form-meeting-duration">
            <Form.Label>Duration</Form.Label>
            <Form.Control type="time" name="meetingDuration" value={meetingDuration} onChange={handleMeetingDuration} />
          </Form.Group>
          <Form.Group controlId="form-meeting-location">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="meetingLocation" value={meetingLocation} onChange={handleMeetingLocation} />
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
