import React from 'react';
import { useSelector } from 'react-redux';

import {
  selectBots,
} from 'src/features/bot/botSlice';

import Bot from './Bot';

const Home = () => {
  const bots = useSelector(selectBots);

  return (
    <div
      style={{
        display: "grid",
        rowGap: "1rem"
      }}
    >
      {
        bots.map(b => {
          const { id } = b;

          return (
            <Bot
              key={id}
              id={id}
            />
          );
        })
      }
    </div>
  );
};

export default Home;
