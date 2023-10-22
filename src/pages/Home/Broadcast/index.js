import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import { useSelector } from 'react-redux'; 

import {
  Ratio,
} from 'react-bootstrap';

import {
  selectBot,
} from '../../../features/bot/botSlice';

import Game from './game';

import { DEFAULT_CONFIG } from './game/config';

const Broadcast = ({ id, player, match, mode }) => {
  const [game, setGame] = useState();
  const container = useRef(null);

  const {
    map,
  } = useSelector(selectBot(id));

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
      if (!map && game) {
        console.log("destroy game 1");
        game.destroy(true);
      }
    }
  }, [
    container,
    game,
    map,
    mode,
    match,
    player,
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
