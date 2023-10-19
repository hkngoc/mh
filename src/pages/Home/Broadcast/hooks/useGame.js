import { useState, useEffect } from 'react';

import { Game } from 'phaser';
// import Game from './game';

const useGame = (config, ref) => {
  const [game, setGame] = useState();

  useEffect(() => {
    if (!game && ref.current) {
      const newGame = new Game({ ...config, parent: ref.current });

      setGame(newGame);
    }

    return () => {
      // game?.destroy(true);
    }
  }, [
    config,
    ref,
    game,
  ]);

  useEffect(() => {
    return () => {
      game?.destroy(true);
    }
  }, [game]);

  return game;
};

export default useGame;
