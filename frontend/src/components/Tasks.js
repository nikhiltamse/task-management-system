import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [message, setMessage] = useState('');
  const [editTask, setEditTask] = useState(null); // For editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [userId] = useState(1); // Hardcoded for demo

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/tasks/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      setMessage('Failed to fetch tasks: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/tasks', { title, description, status, userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setMessage('Task created successfully!');
    } catch (error) {
      setMessage('Failed to create task: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/tasks/${editTask.id}`, editTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(t => t.id === editTask.id ? response.data : t));
      setShowEditModal(false);
      setMessage('Task updated successfully!');
    } catch (error) {
      setMessage('Failed to update task: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== id));
      setMessage('Task deleted successfully!');
    } catch (error) {
      setMessage('Failed to delete task: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      {message && <Alert variant={message.includes('failed') ? 'danger' : 'success'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="description" className="mt-2">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="status" className="mt-2">
          <Form.Label>Status</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Add Task</Button>
      </Form>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(task)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(task.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editTask && (
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="editTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="editDescription" className="mt-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editStatus" className="mt-2">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editTask.status}
                  onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">Update Task</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Tasks;