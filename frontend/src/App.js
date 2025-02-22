import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Register from './components/Register';
import Login from './components/Login';
import Tasks from './components/Tasks';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Task Manager</Navbar.Brand>
          <Nav className="me-auto">
            {!token ? (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
                <Button variant="outline-light" onClick={logout}>Logout</Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/tasks" element={<Tasks token={token} />} />
          <Route path="/" element={<h2>Welcome to Task Manager</h2>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;