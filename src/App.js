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
  Modal,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { Gear, Robot } from 'react-bootstrap-icons';

import Home from './pages/Home';
import Setting from './pages/Setting';
import AddBot from './pages/AddBot';

import Counter from './pages/Counter';

const App = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

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
            </Nav>
            <Nav className="gap-2 align-items-start">
              <Button
                variant="outline-success"
                onClick={() => setShowAdd(true)}
              >
                <Robot />
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowSetting(true)}
              >
                <Gear />
              </Button>

            </Nav>
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
        show={showAdd}
        onHide={() => setShowAdd(false)}
      />
      <Modal
        show={showSetting}
        onHide={() => setShowSetting(false)}
        size="lg"
        scrollable={true}
      >
        <Modal.Header>
          <Modal.Title>
            Setting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "20rem" }}>
          <Setting />
        </Modal.Body>
      </Modal>
    </Router>
  );
};

export default App;
