const express = require('express');
const router = express.Router();
const Project = require('../models/project');

// CREATE a new project
router.post('/create', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.name) payload.name = payload.name.trim();
    const project = await Project.create(payload);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET projects by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Find projects where the user is a member
    const projects = await Project.find({ members: userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE project by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE project status
router.put('/:id/status', async (req, res) => {
  try {
    const status = req.body.status?.trim();
    if (!status) throw new Error('Status must be a non-empty string');
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE project by ID
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all projects
router.delete('/', async (req, res) => {
  try {
    await Project.deleteMany({});
    res.json({ deletedAll: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET progress
router.get('/:id/progress', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const totalTime = project.trackedTime?.reduce((sum, entry) => sum + (Number(entry.timeSpent) || 0), 0) || 0;
    const progress = project.goalTime ? Math.min((totalTime / project.goalTime) * 100, 100) : 0;
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET time spent
router.get('/:id/time', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const timeSpent = project.trackedTime?.reduce((sum, entry) => sum + (Number(entry.timeSpent) || 0), 0) || 0;
    res.json({ timeSpent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET due date
router.get('/:id/due', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json({ dueDate: project?.dueDate ?? null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET streak
router.get('/:id/streak', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
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

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET members
router.get('/:id/members', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members');
    res.json(project.members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD member
router.post('/:id/members', async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE member
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    project.members = project.members.filter(
      (member) => member.toString() !== req.params.userId
    );
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET tracked time for user
router.get('/:id/time/:userId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const entry = project.trackedTime.find(
      (item) => item.userId?.toString() === req.params.userId
    );
    res.json({ timeSpent: entry ? Number(entry.timeSpent) || 0 : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE tracked time
router.put('/:id/time/:userId', async (req, res) => {
  try {
    const { timeSpent } = req.body;
    const project = await Project.findById(req.params.id);
    const entry = project.trackedTime.find(
      (item) => item.userId?.toString() === req.params.userId
    );
    if (entry) {
      entry.timeSpent = timeSpent;
    } else {
      project.trackedTime.push({ userId: req.params.userId, timeSpent });
    }
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE tracked time
router.delete('/:id/time/:userId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    project.trackedTime = project.trackedTime.filter(
      (item) => item.userId?.toString() !== req.params.userId
    );
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
