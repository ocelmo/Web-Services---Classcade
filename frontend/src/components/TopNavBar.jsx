import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBarStyle from '../styles/TopNavBarStyle';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';

const TopNavBar = ({ currentProjectId, setCurrentProjectId }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return;

    // Fetch user's projects
    axios.get(`http://localhost:5000/api/projects/user/${storedUser.id}`)
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  const goToDashboard = () => {
    if (currentProjectId) {
      navigate(`/dashboard/${currentProjectId}`);
    } else if (projects.length > 0) {
      setCurrentProjectId(projects[0]._id);
      navigate(`/dashboard/${projects[0]._id}`);
    } else {
      navigate('/dashboard'); // fallback
    }
  };

  const goToAddNewProject = () => {
    navigate('/new-project');
  };

  const handleProjectClick = (projectId) => {
    setCurrentProjectId(projectId);
    navigate(`/dashboard/${projectId}`);
  };

  const handleCloseTab = (projectId) => {
    setProjects(prev => prev.filter(p => p._id !== projectId));
    if (currentProjectId === projectId && projects.length > 1) {
      const nextProject = projects.find(p => p._id !== projectId);
      setCurrentProjectId(nextProject._id);
      navigate(`/dashboard/${nextProject._id}`);
    } else if (projects.length === 1) {
      setCurrentProjectId(null);
      navigate('/dashboard');
    }
  };

  return (
    <div style={TopNavBarStyle.topNavbar}>
      <button style={TopNavBarStyle.homeBtn} onClick={goToDashboard}>
        <FaHome size={24} />
      </button>

      <div style={TopNavBarStyle.groupTabs}>
        {projects.map(project => (
          <div key={project._id} style={TopNavBarStyle.groupTab}>
            <span onClick={() => handleProjectClick(project._id)}>{project.name}</span>
            <button
              style={TopNavBarStyle.closeTabBtn}
              onClick={() => handleCloseTab(project._id)}
            >
              ✕
            </button>
          </div>
        ))}
        <button style={TopNavBarStyle.addTabBtn} onClick={goToAddNewProject}>＋</button>
      </div>

      <button style={TopNavBarStyle.exitBtn}>✕</button>
    </div>
  );
};

export default TopNavBar;
