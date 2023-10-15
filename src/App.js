import React from 'react';

import {
  Routes,
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';

import {
  Container,
  Nav,
  Navbar,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import Home from './pages/Home';
import Setting from './pages/Setting';

import Counter from './pages/Counter';

const App = () => {
  return (
    <Router basename="/">
      <Navbar
        expand="lg"
        className="bg-body-tertiary "
        bg="dark"
        data-bs-theme="dark"
        sticky="top"
      >
        <Container>
          <Navbar.Brand>
            <Link className="text-decoration-none text-white" to="/">
              MH
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <div className="nav-link" role="button">
                <Link className="text-decoration-none text-white" to="/setting">
                  Setting
                </Link>
              </div>
              <div className="nav-link" role="button">
                <Link className="text-decoration-none text-white" to="/counter">
                  Counter
                </Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-3">
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/setting" Component={Setting} />
          <Route path="/counter" Component={Counter} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
