import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [filterStatus, setFilterStatus] = useState('');
  const [message, setMessage] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserId();
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchTasks(userId);
    }
  }, [filterStatus, userId]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserId(response.data.id);
    } catch (error) {
      toast.error('Failed to fetch user: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchTasks = async (id) => {
    if (!id) {
      setMessage('User ID not available');
      return;
    }
    try {
      const url = filterStatus ?
        `http://localhost:8080/tasks/user/${id}?status=${filterStatus}` :
        `http://localhost:8080/tasks/user/${id}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
      if (response.data.length === 0) {
        setMessage('No tasks found—add one or adjust the filter!');
      } else {
        setMessage('');
      }
    } catch (error) {
      toast.error('Failed to fetch tasks: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
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
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task: ' + (error.response?.data?.message || error.message));
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
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task: ' + (error.response?.data?.message || error.message));
    }
  };

  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="mb-4">Tasks</h2>
      {message && <Alert variant={message.includes('failed') ? 'danger' : 'info'}>{message}</Alert>}
      <Form className="mb-4">
        <Form.Group controlId="filterStatus">
          <Form.Label>Filter by Status</Form.Label>
          <Form.Select value={filterStatus} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Form.Select>
        </Form.Group>
      </Form>
      <Form onSubmit={handleSubmit} className="mb-4 p-3 bg-light rounded shadow-sm">
        <Row>
          <Col md={4}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button variant="primary" type="submit">Add Task</Button>
          </Col>
        </Row>
      </Form>
      {tasks.length > 0 ? (
        <Row>
          {tasks.map(task => (
            <Col md={4} key={task.id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{task.title}</Card.Title>
                  <Card.Text>{task.description}</Card.Text>
                  <Card.Text><strong>Status:</strong> {task.status}</Card.Text>
                  <Button variant="outline-warning" size="sm" onClick={() => handleEdit(task)} className="me-2">Edit</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(task)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}

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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the task "{taskToDelete?.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Tasks;