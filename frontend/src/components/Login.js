import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/login', { username, password });
      const token = response.data;
      const userResponse = await axios.get('http://localhost:8080/users/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const roles = userResponse.data.roles;
      setToken(token, roles);
      setUsername('');
      setPassword('');
      toast.success('Login successful!');
      navigate('/tasks');
    } catch (error) {
      toast.error('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="mb-4">Login</h2>
      <Card className="shadow-sm p-3">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;