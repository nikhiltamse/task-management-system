import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Login from './components/Login';
import Tasks from './components/Tasks';
import AdminUsers from './components/AdminUsers';
import AdminTasks from './components/AdminTasks';
import Profile from './components/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('roles') === 'ADMIN');

  const logout = () => {
    setToken('');
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  };

  const handleLogin = (newToken, roles) => {
    setToken(newToken);
    setIsAdmin(roles === 'ADMIN');
    localStorage.setItem('token', newToken);
    localStorage.setItem('roles', roles);
  };

  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Task Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!token ? (
                <>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  {isAdmin && (
                    <>
                      <Nav.Link as={Link} to="/admin/users">Admin Users</Nav.Link>
                      <Nav.Link as={Link} to="/admin/tasks">Admin Tasks</Nav.Link>
                    </>
                  )}
                  <Button variant="outline-light" onClick={logout} className="ms-2">Logout</Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route path="/register" element={<Register setToken={handleLogin} />} />
          <Route path="/login" element={<Login setToken={handleLogin} />} />
          <Route path="/tasks" element={<Tasks token={token} />} />
          <Route path="/profile" element={<Profile token={token} />} />
          <Route path="/admin/users" element={<AdminUsers token={token} />} />
          <Route path="/admin/tasks" element={<AdminTasks token={token} />} />
          <Route path="/" element={<h2 className="text-center">Welcome to Task Manager</h2>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </Container>
    </Router>
  );
}

export default App;