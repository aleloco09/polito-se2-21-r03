import React, { useState, useEffect } from 'react';

import { ModalComponent } from '../../components';
import { Container, Row, Button, Col, Form } from 'react-bootstrap/';
import Navigation from '../../components/Navigation';

export function Dashboard(props) {

  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(1);
  const [serviceName, setServiceName] = useState('');
  const [newTicketId, setNewTicketId] = useState(-1);
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

  const handleClose = () => {
    setActive(MODAL.CLOSED);
  }

  /**
   * Markup
   */
  const servicesMarkup = (services.length > 0) && (
    <Form.Control name="color" as="select" required autoFocus value={serviceName}
      onChange={(ev) => {
        const tmp = services.filter(item => item.serviceName === ev.target.value);
        setServiceName(ev.target.value);
        setServiceId(tmp[0].serviceTypeId);
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
              <h3 className="mb-4">Select service type</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  {servicesMarkup}
                </Form.Group>
                <Button variant="primary" type="submit" style={{ width: '100%' }}>Get ticket</Button>
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