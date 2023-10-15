import React from 'react';

import { useSelector } from 'react-redux';

import {
  Card,
  Row,
  Col,
  Button,
} from 'react-bootstrap';

import {
  // Play,
  Pause,
  Trash,
} from 'react-bootstrap-icons';

import { selectBot } from '../../../features/bot/botSlice';

const Bot = ({ id }) => {
  const bot = useSelector(selectBot(id));
  const {
    game,
    host: {
      host,
    },
    player: {
      name,
      key
    }
  } = bot;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{game}</Card.Title>
        <Row>
          <Col>
            <Card.Text>{`${host}`}</Card.Text>
            <Card.Text title={key}>{`${name}`}</Card.Text>
          </Col>
          <Col className="align-self-center">
            <div
              className="d-flex flex-row-reverse"
              style={{
                columnGap: "1rem"
              }}
            >
              <Button variant="outline-danger"><Trash /></Button>
              <Button
                variant="outline-secondary"
              >
                <Pause />
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Bot;
