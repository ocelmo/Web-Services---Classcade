import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import LogoutImg from '../assets/Logout.png';
import axios from 'axios';

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#DDF9EA',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'auto',
  },
  inner: {
    width: '100%',
    maxWidth: 1000,
    marginTop: 40,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    position: 'relative',
  },
  heading: {
    fontSize: 44,
    fontWeight: 800,
    margin: 0,
    color: '#0F3E2D',
    textAlign: 'center',
    fontFamily: 'Inter, Arial, sans-serif'
  },
  subtitle: {
    color: '#2e7d32',
    fontSize: 18,
    marginTop: -8,
    textAlign: 'center'
  },
  list: {
    width: '100%',
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '16px 20px',
    border: '1px solid #a3b7acff',
    boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  badge: {
    width: 40,
    height: 36,
    borderRadius: 8,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 24,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 600,
  },
  cardMeta: {
    display: 'flex',
    gap: 24,
    color: '#333',
    alignItems: 'center'
  },
  metaText: {
    fontStyle: 'italic',
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#e53935',
    fontSize: 35,
    cursor: 'pointer'
  },
  newGroupBtn: {
    marginLeft: 20,
    padding: '12px 24px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #a3b7acff',
    boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  logoutBtn: {
    position: 'fixed',
    top: 12,
    left: 8,
    width: 50,
    height: 50,
    backgroundColor: '#DDF9EA',
    border: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    color: '#0F3E2D',
    fontWeight: 'bold',
    zIndex: 9999,
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Get the logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/'); // redirect to login if not logged in
      return;
    }
    setUser(storedUser);

    // Fetch projects for this user
    axios.get(`http://localhost:5000/api/projects/user/${storedUser.id}`)
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  const handleCardClick = (projectId, projectName) => {
    console.log(`Card clicked: ${projectName} (ID: ${projectId})`);
    navigate(`/dashboard/${projectId}`);
  };

  const handleDeleteClick = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleNewProjectClick = () => {
    navigate('/addnewproject');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null; // prevent rendering before user is loaded

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <img src={LogoutImg} alt="logout" style={{ width: 26, height: 31 }} />
        </button>
        <img src={Logo} alt="logo" style={{ width: 120, height: 120 }} />
        <h1 style={styles.heading}>Welcome to CLASSCADE {user.name}!</h1>
        <div style={styles.subtitle}>Click a project or create a new one to get started</div>

        <div style={styles.list}>
          {projects.map((p, index) => (
            <div key={p._id} style={styles.card} onClick={() => handleCardClick(p._id, p.name)}>
              <div style={styles.cardLeft}>
                <div style={styles.badge}>{index + 1}.</div>
                <div style={styles.cardContent}>
                  <div style={styles.cardTitle}>{p.name}</div>
                  <div style={styles.cardMeta}>
                    <div style={styles.metaText}>Status: {p.status}</div>
                    <div style={styles.metaText}>
                      Last Modified: {new Date(p.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <button style={styles.deleteBtn} onClick={(e) => handleDeleteClick(e, p._id)}>
                &#128465;
              </button>
            </div>
          ))}
        </div>

        <button style={styles.newGroupBtn} onClick={handleNewProjectClick}>
          + New Project
        </button>
      </div>
    </div>
  );
};

export default HomePage;