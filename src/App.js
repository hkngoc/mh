import React, {
  useState,
} from 'react';

import {
  Routes,
  Route,
  // BrowserRouter as Router,
  HashRouter as Router,
} from 'react-router-dom';

import {
  Container,
  Nav,
  Navbar,
  Button,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { Robot } from 'react-bootstrap-icons';

import Home from './pages/Home';
import Setting from './pages/Setting';
import AddBot from './pages/AddBot';

import Counter from './pages/Counter';

const App = () => {
  const [show, setShow] = useState(false);

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
            </Nav>
            <Button
              variant="outline-success"
              onClick={() => setShow(true)}
            >
              <Robot />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-3">
        <Routes>
          <Route path="/setting" Component={Setting} />
          <Route path="/counter" Component={Counter} />

          <Route path="/" Component={Home} />
        </Routes>
      </Container>
      <AddBot
        show={show}
        onHide={() => setShow(false)}
      />
    </Router>
  );
};

export default App;
