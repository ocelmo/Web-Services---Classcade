import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardStyle from '../styles/DashboardStyle';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import PrimaryButton from '../components/PrimaryButton';
import ProfileCircle from '../components/ProfileCircle';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // get projectId from URL
  const [project, setProject] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(projectId);

  // Fetch project whenever projectId changes
  useEffect(() => {
  const fetchProject = async () => {
    if (!projectId) return;
    const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
    setProject(res.data);
  };
  fetchProject();
}, [projectId]);

  // Helper to calculate overall progress
  const calculateProgress = () => {
    const totalTime = project.trackedTime?.reduce((sum, entry) => sum + (Number(entry.timeSpent) || 0), 0) || 0;
    return project.goalTime ? Math.min((totalTime / project.goalTime) * 100, 100) : 0;
  };

  // Helper to calculate streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;

    const uniqueDates = project.trackedTime
      ?.map((entry) => entry.updatedAt || entry.createdAt)
      .filter(Boolean)
      .map((date) => new Date(date).toDateString())
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort((a, b) => new Date(a) - new Date(b)) || [];

    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const current = new Date(uniqueDates[i]);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - streak);
      if (current.toDateString() === expected.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div style={DashboardStyle.container}>
      <TopNavBar
        currentProjectId={currentProjectId}
        setCurrentProjectId={setCurrentProjectId}
      />
      <div style={DashboardStyle.layout}>
        <SideBar />
        <main style={DashboardStyle.main}>
          <div style={DashboardStyle.profileHeader}>
            <ProfileCircle
              avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500"
              size={64}
            />
          </div>

          <div style={DashboardStyle.statsPanel}>
            <h2>{project.name} Dashboard</h2>

            <div style={DashboardStyle.statsGrid}>
              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Overall Progress</label>
                <div style={DashboardStyle.progressBar}>
                  <div
                    style={{ ...DashboardStyle.progressFill, width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span>{Math.round(calculateProgress())}%</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Streak</label>
                <span>{calculateStreak()}</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Time Spent</label>
                <span>
                  {project.trackedTime?.reduce((sum, entry) => sum + (Number(entry.timeSpent) || 0), 0) || 0} Hours
                </span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Project Due Date</label>
                <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>

              {/* Placeholder for current active task and task due date */}
              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Current Active Task</label>
                <span>N/A</span>
              </div>

              <div style={DashboardStyle.statItem}>
                <label style={DashboardStyle.statLabel}>Task Due Date</label>
                <span>N/A</span>
              </div>
            </div>

            <div style={DashboardStyle.actionButtons}>
              <PrimaryButton text="Detailed Stats" />
              <PrimaryButton text="Track Time" />
              <PrimaryButton text="Schedule Meeting" />
              <PrimaryButton
                text="Add New Project"
                onClick={() => navigate('/new-project')}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;