import React, { useEffect, useRef } from 'react';

import {
  Ratio,
} from 'react-bootstrap';

import useGame from './hooks/useGame';
import config from './game/config';

const Broadcast = ({ id, match }) => {
  const container = useRef(null);

  const game = useGame(config, container);

  useEffect(() => {
    if (match) {

    }

    return () => {
      
    }
  }, [match]);

  return (
    <Ratio aspectRatio="16x9">
      <div id={`phaser-container-${id}`} ref={container} />
    </Ratio>
  );
};

export default Broadcast;
