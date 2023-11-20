import React, {
  useEffect,
  useCallback,
  useState,
} from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
  Card,
  Row,
  Col,
  Button,
} from 'react-bootstrap';

import {
  Play,
  Pause,
  Trash,
  Eye,
  EyeSlash,
} from 'react-bootstrap-icons';

import {
  selectBot,
  removeBot,
  cleanMap,
} from '../../../features/bot/botSlice';

import { Match } from '../../../bot';

import Broadcast from '../Broadcast';

const Bot = ({ id }) => {
  const dispatch = useDispatch();

  const [match, setMatch] = useState(null);
  const [joined, setJoined] = useState(false);
  const [preview, setPreview] = useState(false);

  const playerInGame = useSelector(selectBot(id));
  const {
    game,
    host: {
      host,
    },
    player: {
      name,
      key,
    }
  } = playerInGame;

  useEffect(() => {
    // just check working of typescript and prepare for InversifyJS DI
    // currently, we have no idea to setup concept for bot, socket connection, match... with DI inside each Bot component instance :((
    const match = new Match(host, game, key);
    setMatch(match);

    // return () => {
    //   if (match) {
    //     match.dispose();
    //   }
    // };
  }, [
    host,
    game,
    key,
  ]);

  useEffect(() => {
    return () => {
      match?.dispose();
    }
  }, [match]);

  const onConnected = useCallback(({ game_id, player_id }) => {
    if (game_id === game && (player_id.includes(key) || key.includes(player_id))) {
      setJoined(true);
    }
  }, [
    game,
    key,
  ]);

  useEffect(() => {
    dispatch(cleanMap({ id }));

    return () => {
      dispatch(cleanMap({ id }));
    }
  }, [
    id,
    dispatch,
  ]);

  useEffect(() => {
    const unregister = match?.registerJoinGame(onConnected);

    return () => {
      unregister?.();
    }
  }, [
    match,
    onConnected,
  ]);

  const handleJoinGame = useCallback(() => {
    if (match) {
      match.joinGame();
    }
  }, [match]);

  const handleDisconnect = useCallback(() => {
    if (match) {
      match.disconnect();
      setJoined(false);
    }

    dispatch(cleanMap({ id }));
  }, [
    match,
    id,
    dispatch,
  ]);

  const handleRemoveBot = useCallback(() => {
    if (match) {
      setJoined(false);
      match.dispose();
    }

    dispatch(removeBot(id));
  }, [
    id,
    match,
    dispatch,
  ]);

  useEffect(() => {
    if (!joined) {
      setPreview(false);
    }
  }, [
    joined,
  ])

  const togglePreview = useCallback(() => {
    setPreview((preview) => !preview);
  }, []);

  return (
    <div className="d-grid gap-2 grid-bot-item align-items-start">
      <Card>
        <Card.Body>
          <Card.Title className="d-flex align-items-center justify-content-between">
            <span className="text-nowrap text-truncate">{game}</span>
            <Button
              variant="outline-secondary"
              onClick={togglePreview}
              disabled={!joined}
            >
              {
                preview ? (
                  <EyeSlash />
                ) : (
                  <Eye />
                )
              }
            </Button>
          </Card.Title>
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
                <Button
                  variant="outline-danger"
                  onClick={handleRemoveBot}
                >
                  <Trash />
                </Button>
                {
                  joined ? (
                    <Button
                      variant="outline-secondary"
                      onClick={handleDisconnect}
                    >
                      <Pause />
                    </Button>
                  ) : (
                    <Button
                      variant="outline-success"
                      onClick={handleJoinGame}
                    >
                      <Play />
                    </Button>
                  )
                }
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {
        joined && preview && (
          <Broadcast
            id={id}
            match={match}
            mode="training"
            player={key}
          />
        )
      }
    </div>
  );
};

export default Bot;
