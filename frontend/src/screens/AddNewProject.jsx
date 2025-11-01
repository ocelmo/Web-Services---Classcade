import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import AddNewGroupStyle from '../styles/AddNewGroupStyle';

const AddNewProject = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);        
  const [selectedGroup, setSelectedGroup] = useState('');
  const [useNewGroup, setUseNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user'));

  // 🔹 Fetch groups for the current user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/groups'); 
        setGroups(res.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };
    fetchGroups();
  }, []);

  // 🔹 Handle project creation
  const handleSubmit = async () => {
    if (!projectName || (!selectedGroup && (!useNewGroup || !newGroupName))) {
      alert('Please select a group or create a new one, and enter a project name.');
      return;
    }

    try {
      let groupId = selectedGroup;

      // If creating a new group, create it first
      if (useNewGroup && newGroupName) {
        const groupRes = await axios.post('http://localhost:5000/api/groups/create', {
          name: newGroupName,
          members: [storedUser._id]
        });
        groupId = groupRes.data._id;
      }

      // Create the project under the selected/created group
      const projectRes = await axios.post('http://localhost:5000/api/projects/create', {
        name: projectName,
        members: [storedUser._id],
        groupId,
        goalTime: 10
      });

      const newProject = projectRes.data;
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

            {/* 🔹 Choose between existing group or new group */}
            <label style={AddNewGroupStyle.label}>
              <input
                type="radio"
                checked={!useNewGroup}
                onChange={() => setUseNewGroup(false)}
              /> Select existing group
            </label>

            {!useNewGroup && groups.length > 0 ? (
              <select
                style={AddNewGroupStyle.select}
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">-- Choose a group --</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            ) : (
              <p>No existing groups available.</p>
            )}

            <label style={AddNewGroupStyle.label}>
              <input
                type="radio"
                checked={useNewGroup}
                onChange={() => setUseNewGroup(true)}
              /> Create new group
            </label>

            {useNewGroup && (
              <input
                type="text"
                style={AddNewGroupStyle.input}
                placeholder="Enter new group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            )}

            {/* 🔹 Project name input */}
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
            <p style={AddNewGroupStyle.popupText}>
              Are you sure you want to cancel?
            </p>
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

