import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { SGList, ModalComponent } from '../../components';
import { Container, Row, Button, ListGroup, Col, Form } from 'react-bootstrap/';
import Navigation from '../../components/Navigation';

import styles from '../../components/SGList/SGList.module.css';

const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const RowControl = (props) => {
  const { user, active, onSignup, onCancel } = props;

  return (
    <>
      <div className={'ml-auto '}>
        {(user && !active && (
          <Button variant="link" style={{ color: '#fff' }} className="shadow-none" onClick={onSignup}>Signup</Button>
        ))}
        {(user && active && (
          <Button variant="link" style={{ color: '#fff' }} className="shadow-none" onClick={onCancel}>Cancel</Button>
        ))}
      </div>
    </>
  )
}

export function Dashboard(props) {

  const [sgList, setSGList] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(1);
  const [newTicketId, setNewTicketId] = useState(-1);
  const [meetingList, setMeetingList] = useState([]);
  const [bookedMeetingList, setBookedMeetingList] = useState([]);
  const [update, setUpdate] = useState(0);

  // Modal
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [active, setActive] = useState(MODAL.CLOSED);

  /**
   * First fetch from db
   * - Services
   * - Serving number
   */

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await fetch('/api/services', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        setServices(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchServices();
  }, [setServices, update]);

  /**
   * Create ticket
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const data = await fetch(`/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          officeId: 1,
          serviceTypeId: serviceId
        })
      })
      const response = await data.json();
      setNewTicketId(response.ticketId);

      setActive(MODAL.ADD);
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Ask to join group
   * @param {*} sg 
   */
  const handleAskToJoin = async (sg) => {
    try {
      await fetch(`/api/studygroups/${sg.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Handle meeting signup
   * @param {*} meeting 
   */
  const handleMeetingSignup = async (meeting) => {
    try {
      // Check for overlapping dates
      if (bookedMeetingList.length > 0) {
        let meetingDate;
        let tmp;
        let a, b;
        let a_minutes, b_minutes;
        if (meeting.date !== "" && meeting.time !== "") {
          meetingDate = dayjs(meeting.date + "T" + meeting.time);
        }
        for (const item of bookedMeetingList) {
          tmp = dayjs(item.date + "T" + item.time);
          a = item.duration.split(':');
          b = meeting.duration.split(':');
          a_minutes = (+a[0]) * 60 + (+a[1]);
          b_minutes = (+b[0]) * 60 + (+b[1]);
          if (meetingDate.isBetween(tmp, tmp.add(a_minutes, 'minute'))
            || (meetingDate.isBefore(tmp) && meetingDate.add(b_minutes, 'minute').isAfter(tmp.add(a_minutes, 'minute')))) {
            if (!window.confirm('Are you sure you want to signup? Meetings are overlapping.')) {
              return;
            }
          }
        }
      }
      await fetch(`/api/meetings/${meeting.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const handleClose = () => {
    setActive(MODAL.CLOSED);
  }

  /**
   * Markup
   */
  const servicesMarkup = (services.length > 0) && (
    <Form.Control name="color" as="select" required autoFocus value={serviceId}
      onChange={(ev) => {
        const tmp = services.filter(item => item.serviceName === ev.target.value);
        setServiceId(tmp[0].serviceTypeId)
      }}>
      {services.map((t, index) => {
        return (
          <option key={index}>{t.serviceName}</option>
        )
      })}
    </Form.Control>
  );

  return (
    <Container className="theme-scheme">
      <Navigation loggedIn={props.isLoggedIn} />
      <div className="view">
        <Row className="vh-100">
          <Col>
            <div className="Card">
              <h3 className="text-center">Serving number</h3>
              <h1 className="text-center mt-4 mb-4">A22</h1>
            </div>
          </Col>
          <Col>
            <div className="Card">
              <h3 className="mb-4">Select service type</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  {servicesMarkup}
                </Form.Group>
                <Button variant="outline-primary" type="submit">Get ticket</Button>
              </Form>
            </div>
          </Col>
        </Row>
        {(active !== MODAL.CLOSED) && <ModalComponent ticketId={newTicketId} onClose={handleClose} />
        }
      </div>
    </Container>
  )
}