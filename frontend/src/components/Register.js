import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

function Register({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/register', { username, password, email });
      toast.success('Registration successful! Please login.');
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      toast.error('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="mb-4">Register</h2>
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
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;