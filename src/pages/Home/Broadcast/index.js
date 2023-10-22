import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { useSelector, useDispatch } from 'react-redux'; 

import {
  Ratio,
} from 'react-bootstrap';

import {
  selectBot,
  saveMap,
  cleanMap,
} from '../../../features/bot/botSlice';

import Game from './game';

import { DEFAULT_CONFIG } from './game/config';

const Broadcast = ({ id, player, match, mode }) => {
  const [game, setGame] = useState();
  const container = useRef(null);
  const dispatch = useDispatch();

  const {
    map,
  } = useSelector(selectBot(id));

  const onFirstLoad = useCallback((map) => {
    dispatch(saveMap({ id, map }));
  }, [
    id,
    dispatch,
  ]);

  useEffect(() => {
    const unregister = match?.registerTicktack(onFirstLoad, { once: true });

    return () => {
      unregister?.();
    };
  }, [
    match,
    onFirstLoad,
  ]);

  useEffect(() => {
    if (map && !game && container.current) {

      const newGame = new Game({
        ...DEFAULT_CONFIG,
        mapConfig: map,
        mode: mode,
        match: match,
        player: player,
        parent: container.current,
      });

      setGame(newGame);
    }

    return () => {
      dispatch(cleanMap({ id }));
      game?.destroy(true);
      setGame(null);
    }
  }, [
    container,
    game,
    map,
    mode,
    match,
    player,
    id,
    dispatch,
  ]);

  return (
    <Ratio
      aspectRatio={"16x9"}
    >
      <div id={`phaser-container-${id}`} ref={container} />
    </Ratio>
  );
};

export default Broadcast;
