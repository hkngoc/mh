import React, {
  useCallback,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Tabs,
  Tab,
} from 'react-bootstrap';

import {
  saveTab,
  selectTab,
} from '../../features/setting/settingSlice';

import Host from './Host';
import Player from './Player/index';

const Setting = () => {
  const dispatch = useDispatch();
  const tab = useSelector(selectTab);

  const onSelectTab = useCallback((eventKey) => {
    dispatch(saveTab(eventKey));
  }, [
    dispatch,
  ]);

  return (
    <Tabs
      className="mb-3"
      variant="underline"
      justify={true}
      defaultActiveKey={tab}
      onSelect={onSelectTab}
    >
      <Tab eventKey="host" title="Host">
        <Host />
      </Tab>
      <Tab eventKey="player" title="Player">
        <Player />
      </Tab>
    </Tabs>
  );
};

export default Setting;
