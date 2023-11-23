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
  setJoined,
} from '../../../features/bot/botSlice';

import { Match } from '../../../bot';

import Broadcast from '../Broadcast';

const Bot = ({ id }) => {
  const dispatch = useDispatch();

  const [match, setMatch] = useState(null);
  const [preview, setPreview] = useState(false);

  const playerInGame = useSelector(selectBot(id));
  const {
    game,
    description,
    host: {
      host,
    },
    player: {
      name,
      key,
    },
    joined,
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

  const handleJoinGame = useCallback(() => {
    if (match) {
      match.joinGame();
    }
  }, [match]);

  const handleDisconnect = useCallback(() => {
    if (match) {
      match.disconnect();
      dispatch(setJoined({ id, joined: false }));
    }

    dispatch(cleanMap({ id }));
  }, [
    match,
    id,
    dispatch,
  ]);

  const onConnected = useCallback(({ game_id, player_id }) => {
    if (game_id === game && (player_id?.includes(key) || key?.includes(player_id))) {
      dispatch(setJoined({ id, joined: true }));
    }
  }, [
    id,
    game,
    key,
    dispatch,
  ]);

  const onDisconnected = useCallback((reason, description) => {
    console.log("disconnect: ", reason);

    handleDisconnect();
  }, [
    handleDisconnect,
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

  useEffect(() => {
    match?.registerDisconnect(onDisconnected);
  }, [
    match,
    onDisconnected,
  ])

  const handleRemoveBot = useCallback(() => {
    if (match) {
      dispatch(setJoined({ id, joined: false }));
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
              <Card.Text>{`${description || ""}`}</Card.Text>
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
