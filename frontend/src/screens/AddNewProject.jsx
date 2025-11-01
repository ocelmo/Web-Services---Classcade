import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import AddNewGroupStyle from '../styles/AddNewGroupStyle';
import axios from 'axios';

const AddNewProject = ({ setCurrentProjectId }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);        
  const [selectedGroup, setSelectedGroup] = useState('');
  const [projectName, setProjectName] = useState('');
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user'));

  // Fetch groups for the current user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/user/${storedUser.id}`);
        setGroups(res.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };
    fetchGroups();
  }, [storedUser.id]);

  const handleSubmit = async () => {
    if (!projectName || !selectedGroup) {
      alert('Please select a group and enter a project name.');
      return;
    }

    try {
      // Create the project via backend
      const groupObj = groups.find(g => g.name === selectedGroup);
      const payload = {
        name: projectName,
        members: [storedUser.id],  // add current user as member
        goalTime: 10,              // default, can adjust
        description: '',
      };

      const res = await axios.post('http://localhost:5000/api/projects/create', payload);
      const newProject = res.data;

      // Update the current project ID in parent state
      setCurrentProjectId(newProject._id);

      // Navigate to dashboard for new project
      navigate(`/dashboard/${newProject._id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project. Check console.');
    }
  };

  const handleCancel = () => setShowCancelPopup(true);

  const confirmCancel = () => {
    setShowCancelPopup(false);
    setShowConfirmPopup(true);
    setTimeout(() => {
      setShowConfirmPopup(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div style={AddNewGroupStyle.container}>
      <TopNavBar />
      <div style={AddNewGroupStyle.layout}>
        <SideBar />
        <main style={AddNewGroupStyle.main}>
          <div style={AddNewGroupStyle.formPanel}>
            <h2 style={AddNewGroupStyle.title}>Add New Project</h2>

            <label style={AddNewGroupStyle.label}>Select Group</label>
            <select
              style={AddNewGroupStyle.select}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">-- Choose a group --</option>
              {groups.map((group) => (
                <option key={group._id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>

            <label style={AddNewGroupStyle.label}>Project Name</label>
            <input
              type="text"
              style={AddNewGroupStyle.input}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />

            <div style={AddNewGroupStyle.actionButtons}>
              <PrimaryButton text="Cancel" onClick={handleCancel} />
              <PrimaryButton text="Create" onClick={handleSubmit} />
            </div>
          </div>
        </main>
      </div>

      {showCancelPopup && (
        <div style={AddNewGroupStyle.overlay}>
          <div style={AddNewGroupStyle.popup}>
            <p style={AddNewGroupStyle.popupText}>Are you sure you want to cancel?</p>
            <div style={AddNewGroupStyle.popupButtons}>
              <PrimaryButton text="Yes" onClick={confirmCancel} />
              <PrimaryButton text="No" onClick={() => setShowCancelPopup(false)} />
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div style={AddNewGroupStyle.overlay}>
          <div style={AddNewGroupStyle.popup}>
            <p style={AddNewGroupStyle.popupText}>Project creation cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewProject;

