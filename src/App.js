import React from 'react';

import {
  Routes,
  Route,
  BrowserRouter,
} from 'react-router-dom';

import Root from './pages/Root';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Root />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
