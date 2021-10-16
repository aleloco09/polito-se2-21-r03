import React from 'react';
import { useHistory } from "react-router-dom";

import { ListGroup, Button } from 'react-bootstrap/';

import styles from './SGList.module.css';

const RowControl = (props) => {
  const { sg, user, onAsk } = props;

  return (
    <>
      <div className={'ml-auto ' + styles.RowButton}>
        {(user && !user.sgs_admin.includes(sg.id) && !user.groups.some(item => item.sg_id === sg.id)) && (
          <Button variant="link" className="shadow-none" onClick={onAsk}>Ask to join</Button>
        )}
        {(user && !user.sgs_admin.includes(sg.id) && user.groups.some(item => item.sg_id === sg.id && item.pending === 1)) && (
          'Pending...'
        )}
      </div>
    </>
  )
}

export function SGList(props) {
  const { sgs, user, onAsk } = props;
  const history = useHistory();

  const handleClick = (id) => {
    // Check if is a general administrator or a group one
    if (user.general_administrator || user.sgs_admin.includes(id))
      history.push(`/${id}`);
  }

  return (
    <>
      <ListGroup as="ul" variant="flush">
        {
          sgs.map(t => {
            return (
              <ListGroup.Item as="li" key={t.id} className="d-flex w-100 justify-content-between Card" style={{ backgroundColor: t.color }}>
                <div className={'flex-fill m-auto ' + styles.CardTitle} onClick={() => handleClick(t.id)}>
                  {t.course_name} - {t.course_code} - {t.course_credits} credits
                </div>
                <RowControl sg={t} user={user} onAsk={() => onAsk(t)} />
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
    </>
  )
}