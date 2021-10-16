import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { SGList, ModalForm } from '../../components';
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
  const [meetingList, setMeetingList] = useState([]);
  const [bookedMeetingList, setBookedMeetingList] = useState([]);
  const [update, setUpdate] = useState(0);

  // Modal
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [active, setActive] = useState(MODAL.CLOSED);

  /**
   * First fetch from db
   * - Study groups
   * - Meetings
   * - Booked meetings
   */
  useEffect(() => {
    const fetchSG = async () => {
      try {
        const data = await fetch('/api/studygroups', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        const tmp = [];
        for (const obj of response) {
          tmp.push({
            id: obj.id,
            course_code: (obj.course_code) && obj.course_code,
            course_name: (obj.course_name) && obj.course_name,
            course_credits: (obj.course_credits) && obj.course_credits,
            color: (obj.color) && obj.color,
          });
        }
        setSGList(tmp);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchMeetings = async () => {
      try {
        const data = await fetch('/api/meetings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        setMeetingList(response);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchBookedMeetings = async () => {
      try {
        const data = await fetch('/api/meetings/booked', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        setBookedMeetingList(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSG();
    fetchMeetings();
    fetchBookedMeetings();
  }, [setSGList, update]);

  /**
   * Create a new study group
   */
  const handleSave = async (sg) => {
    try {
      const data = await fetch('/api/studygroups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_code: sg.courseCode,
          course_name: sg.courseName,
          course_credits: sg.courseCredits,
          color: sg.color,
        })
      })
      await data.json();
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
    setActive(MODAL.CLOSED);
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

  /**
   * Handle meeting cancel
   * @param {*} meeting 
   */
  const handleMeetingCancel = async (meeting) => {
    try {
      await fetch(`/api/meetings/${meeting.id}/`, {
        method: 'DELETE',
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
  const meetingsMarkup = (meetingList.length > 0) && (
    <>
      <h3>All</h3>
      <ListGroup as="ul" variant="flush">
        {
          meetingList.map(t => {
            return (
              <ListGroup.Item as="li" key={t.id} style={{ backgroundColor: t.color }} className="d-flex w-100 justify-content-between Card">
                <div className={'flex-fill m-auto ' + styles.CardTitle}>
                  {t.course_name} - {t.date} - {t.time} - Duration: {t.duration} - {t.location}
                </div>
                <RowControl user={props.user} onSignup={() => handleMeetingSignup(t)} />
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
    </>
  );

  const bookedMeetingsMarkup = (bookedMeetingList.length > 0) && (
    <>
      <h3>Booked</h3>
      <ListGroup as="ul" variant="flush">
        {
          bookedMeetingList.map(t => {
            return (
              <ListGroup.Item as="li" key={t.id} style={{ backgroundColor: t.color }} className="d-flex w-100 justify-content-between Card">
                <div className={'flex-fill m-auto ' + styles.CardTitle}>
                  {t.course_name} - {t.date} - {t.time} - Duration: {t.duration} - {t.location}
                </div>
                <RowControl user={props.user} active={true} onCancel={() => handleMeetingCancel(t)} />
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
    </>
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
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control name="color" as="select" required autoFocus >
                    <option key={1}>black</option>
                    <option key={2}>red</option>
                    <option key={3}>green</option>
                    <option key={4}>blue</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="outline-primary">Get ticket</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  )
}