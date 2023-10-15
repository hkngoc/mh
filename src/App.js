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
import Counter from './pages/Counter';

const App = () => {
  return (
    <Router basename="/">
      <header>
        <Navbar
          expand="lg"
          className="bg-body-tertiary "
          bg="dark"
          data-bs-theme="dark"
          fixed="top"
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
                  <Link className="text-decoration-none text-white" to="/home">
                    Home
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
      </header>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/home" Component={Home} />
        <Route path="/counter" Component={Counter} />
      </Routes>
    </Router>
  );
};

export default App;
