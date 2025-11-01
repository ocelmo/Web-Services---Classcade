import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import axios from 'axios';

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#DDF9EA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    overflow: 'auto',
  },
  container: {
    width: '100%',
    maxWidth: 500,
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    color: '#0F3E2D',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #a3b7acff',
    fontSize: 16,
  },
  button: {
    marginTop: 12,
    padding: '12px 24px',
    backgroundColor: '#2e7d32',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
};

const NewProject = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goalTime, setGoalTime] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !goalTime) {
      alert('Name and Goal Time are required!');
      return;
    }

    try {
      const payload = {
        name,
        description,
        goalTime: Number(goalTime),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        members: [storedUser.id], // add creator as member
      };

      const res = await axios.post('http://localhost:5000/api/projects/create', payload);
      const newProject = res.data;

      // Redirect to dashboard for the new project
      navigate(`/dashboard/${newProject._id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <img src={Logo} alt="logo" style={styles.logo} />
        <h2 style={styles.heading}>Create New Project</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            style={styles.input}
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            style={{ ...styles.input, height: 80 }}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Goal Time (hours)"
            value={goalTime}
            onChange={(e) => setGoalTime(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="date"
            placeholder="Due Date (optional)"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button style={styles.button} type="submit">Create Project</button>
        </form>
      </div>
    </div>
  );
};

export default NewProject;