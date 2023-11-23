import React, { useEffect, useMemo } from 'react';

import {
  Button
} from 'react-bootstrap';

import { Broadcast } from 'react-bootstrap-icons';

import { useSelector } from 'react-redux';
import { useWakeLock } from 'react-screen-wake-lock';

import {
  selectBots,
} from '../../features/bot/botSlice';

const Live = () => {
  const bots = useSelector(selectBots);

  const live = useMemo(() => {
    return bots.find(b => b.joined);
  }, [bots]);

  const {
    isSupported,
    // released,
    request,
    release,
  } = useWakeLock({
    onRequest: () => console.log('Screen Wake Lock: requested!'),
    onError: () => console.log('An error happened 💥'),
    onRelease: () => console.log('Screen Wake Lock: released!'),
  });

  useEffect(() => {
    if (live) {
      request?.();
    } else {
      release?.();
    }
  }, [
    live,
    request,
    release,
  ]);

  if (!live) {
    return null;
  }

  return (
    <Button
      disabled={true}
      variant={isSupported ? "outline-light" : "outline-danger"}
      className="border-0"
    >
      <Broadcast />
    </Button>
  );
};

export default Live;
