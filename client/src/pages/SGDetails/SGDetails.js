import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { MeetingModalForm } from '../../components';
import { Container, Row } from 'react-bootstrap/';
import Navigation from '../../components/Navigation';
import { Button, ListGroup } from 'react-bootstrap/';

export function SGDetails(props) {
  const { user } = props;
  console.log(user);

  const [sgId, setSGId] = useState(-1);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCredits, setCourseCredits] = useState(-1);
  const [studentList, setStudentList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [meetingList, setMeetingList] = useState([]);
  const [update, setUpdate] = useState(0);

  // Modal
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [active, setActive] = useState(MODAL.CLOSED);

  const history = useHistory();

  /**
   * First fetch from db
   * - SG
   * - Members
   * - Pending Members
   * - Administrators
   * - Meetings
   */
  useEffect(() => {
    const fetchSG = async () => {
      try {
        const data = await fetch(`/api/studygroups/${props.match.params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        setSGId(response.id);
        setCourseCode(response.course_code);
        setCourseName(response.course_name);
        setCourseCredits(response.course_credits);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSGMembers = async () => {
      try {
        const data = await fetch(`/api/studygroups/${props.match.params.id}/members`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        setStudentList(response);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSGPendingMembers = async () => {
      try {
        const data = await fetch(`/api/studygroups/${props.match.params.id}/pending`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        setPendingList(response);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSGAdministrators = async () => {
      try {
        const data = await fetch(`/api/studygroups/${props.match.params.id}/administrators`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await data.json();
        setAdminList(response);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSGMeetings = async () => {
      try {
        const data = await fetch(`/api/studygroups/${props.match.params.id}/meetings`, {
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
    fetchSG();
    fetchSGMembers();
    fetchSGPendingMembers();
    fetchSGAdministrators();
    fetchSGMeetings();
  }, [props.match.params.id, update]);

  /**
   * Delete study group 
   */
  const handleDeleteStudyGroup = async () => {
    try {
      await fetch(`/api/studygroups/${props.match.params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Create a new meeting
   */
  const handleSave = async (meeting) => {
    try {
      const data = await fetch(`/api/studygroups/${props.match.params.id}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meeting_date: meeting.meetingDate,
          meeting_time: meeting.meetingTime,
          meeting_duration: meeting.meetingDuration,
          meeting_location: meeting.meetingLocation,
        })
      })
      await data.json();
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
    setActive(MODAL.CLOSED);
  }

  const handleClose = () => {
    setActive(MODAL.CLOSED);
  }

  const handleMakeAdmin = async (id) => {
    try {
      const data = await fetch(`/api/studygroups/${props.match.params.id}/makeadmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: id
        })
      })
      await data.json();
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const handleAccept = async (id) => {
    try {
      const data = await fetch(`/api/studygroups/${props.match.params.id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: id
        })
      })
      await data.json();
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemoveAdmin = async (id) => {
    try {
      const data = await fetch(`/api/studygroups/${props.match.params.id}/removeadmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: id
        })
      })
      await data.json();
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemove = async (id) => {
    try {
      const data = await fetch(`/api/studygroups/${props.match.params.id}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: id
        })
      })
      await data.json();
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  }

  /** 
   * Markup 
   * */
  const membersMarkup = studentList.length > 0 && (
    <ListGroup variant="flush">
      {studentList.map((item) => {
        return (
          <ListGroup.Item key={item.id} className="d-flex w-100 justify-content-between">
            <div className="flex-fill m-auto">{item.name}</div>
            <div className="flex-fill m-auto">
              {user && user.general_administrator === 1 && (
                <Button variant="link" className="shadow-none" onClick={() => handleMakeAdmin(item.id)}>Make group admin</Button>
              )}
              {user && user.sgs_admin.includes(sgId) && (
                <Button variant="link" className="shadow-none" onClick={() => handleRemove(item.id)}>Remove student</Button>
              )}
            </div>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )

  const pendingsMarkup = pendingList.length > 0 && (
    <ListGroup variant="flush">
      {pendingList.map((item) => {
        return (
          <ListGroup.Item key={item.id} className="d-flex w-100 justify-content-between">
            <div className="flex-fill m-auto">{item.name}</div>
            <div className="flex-fill m-auto">
              <Button variant="link" className="shadow-none" onClick={() => handleAccept(item.id)}>Accept request</Button>
            </div>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )

  const adminsMarkup = adminList.length > 0 && (
    <ListGroup variant="flush">
      {adminList.map(item => {
        return (
          <ListGroup.Item key={item.id} className="d-flex w-100 justify-content-between">
            <div className="flex-fill m-auto">{item.name}</div>
            <div className="flex-fill m-auto">
              {user && user.general_administrator === 1 && (
                <Button variant="link" className="shadow-none" onClick={() => handleRemoveAdmin(item.id)}>Remove group admin</Button>
              )}
            </div>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )

  const meetingsMarkup = meetingList.length > 0 && (
    <ListGroup variant="flush">
      {meetingList.map((item) => {
        return (
          <ListGroup.Item key={item.id}>{item.date} - {item.time} - Duration: {item.duration} - {item.location}</ListGroup.Item>
        )
      })}
    </ListGroup>
  )

  return (
    <Container>
      <Navigation />
      <Row className="vh-100">
        <div className="view">
          <div>
            <div className="d-flex">
              <h1>{courseName}</h1>
              <Button className="ml-auto" variant="outline-danger" onClick={handleDeleteStudyGroup}>Remove Study Group</Button>
            </div>
            <p>Code: {courseCode} - Credits: {courseCredits}</p>
          </div>
          <div className="mt-4">
            <h3>Group Administrators</h3>
            {adminsMarkup}
          </div>
          <div className="mt-4">
            <h3>Members</h3>
            {membersMarkup}
          </div>
          <div className="mt-4">
            <h3>Pending Members</h3>
            {pendingsMarkup}
          </div>
          <div className="mt-4">
            <h3>Meetings</h3>
            {meetingsMarkup}
          </div>
          {user && user.sgs_admin.includes(sgId) && (
            <Button size="lg" className="fixed-right-bottom NewMemeButton" onClick={() => setActive(MODAL.ADD)}>+</Button>
          )}
          {(active !== MODAL.CLOSED) && <MeetingModalForm user={props.user} onSave={handleSave} onClose={handleClose} />}
        </div>
      </Row>
    </Container>
  )
}