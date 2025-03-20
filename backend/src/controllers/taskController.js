const Task = require('../models/Task');
const User = require('../models/User');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ importance: -1, deadline: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, deadline, importance, draft, description, timeEstimate, tags } = req.body;
  try {
    const task = new Task({ 
      userId: req.user.id, 
      title, 
      deadline, 
      importance, 
      draft,
      description,
      timeEstimate,
      tags
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    // Make sure only task owner can update it
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this task' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    // Make sure only task owner can delete it
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this task' });
    }
    
    await Task.findByIdAndDelete(id);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Focus mode operations
exports.startFocusSession = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to start focus session for this task' });
    }
    
    const newSession = {
      startTime: new Date(),
      breaks: []
    };
    
    task.focusSessions = [...(task.focusSessions || []), newSession];
    await task.save();
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.endFocusSession = async (req, res) => {
  const { taskId } = req.params;
  const { duration } = req.body;
  
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to end focus session for this task' });
    }
    
    // Get the latest session and update it
    if (!task.focusSessions || task.focusSessions.length === 0) {
      return res.status(400).json({ msg: 'No active focus session found' });
    }
    
    const lastSessionIndex = task.focusSessions.length - 1;
    task.focusSessions[lastSessionIndex].endTime = new Date();
    task.focusSessions[lastSessionIndex].duration = duration;
    
    // Update last time spent for easy reference
    task.lastTimeSpent = duration;
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recordBreak = async (req, res) => {
  const { taskId } = req.params;
  const { startTime, endTime, duration } = req.body;
  
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to record break for this task' });
    }
    
    // Add break to the latest focus session
    if (!task.focusSessions || task.focusSessions.length === 0) {
      return res.status(400).json({ msg: 'No active focus session found' });
    }
    
    const lastSessionIndex = task.focusSessions.length - 1;
    task.focusSessions[lastSessionIndex].breaks.push({
      startTime,
      endTime,
      duration
    });
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Collaborative features
exports.shareTask = async (req, res) => {
  const { taskId } = req.params;
  const { email } = req.body;
  
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to share this task' });
    }
    
    // Add user to the shared list if not already there
    const sharedWith = task.sharedWith || [];
    
    // Check if already shared with this user
    const alreadyShared = sharedWith.find(user => user.email === email);
    if (!alreadyShared) {
      sharedWith.push({
        email,
        isAssigned: false
      });
      
      task.sharedWith = sharedWith;
      task.shared = true;
      await task.save();
    }
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignTask = async (req, res) => {
  const { taskId } = req.params;
  const { email } = req.body;
  
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to assign this task' });
    }
    
    // Find the user in the shared list and update assignment
    if (!task.sharedWith) {
      return res.status(400).json({ msg: 'Task is not shared with anyone' });
    }
    
    const userIndex = task.sharedWith.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return res.status(400).json({ msg: 'User not found in shared list' });
    }
    
    // Toggle assignment status
    task.sharedWith[userIndex].isAssigned = !task.sharedWith[userIndex].isAssigned;
    task.sharedWith[userIndex].assignedAt = task.sharedWith[userIndex].isAssigned ? new Date() : null;
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;
  
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check if user is owner or the task is shared with them
    const isOwner = task.userId.toString() === req.user.id;
    const isSharedWith = task.sharedWith && task.sharedWith.some(user => user.email === req.user.email);
    
    if (!isOwner && !isSharedWith) {
      return res.status(401).json({ msg: 'Not authorized to comment on this task' });
    }
    
    // Get user email from database using the user ID
    const user = await User.findById(req.user.id);
    
    // Add comment
    const newComment = {
      author: user.email,
      text,
      timestamp: new Date()
    };
    
    task.comments = [...(task.comments || []), newComment];
    await task.save();
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeTask = async (req, res) => {
  const { taskId } = req.params;
  const { timeSpent, notes } = req.body;
  
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    // Check ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to complete this task' });
    }
    
    // Update task to completed and add completion record
    task.completed = true;
    
    const completionRecord = {
      timeSpent,
      completedAt: new Date(),
      notes
    };
    
    task.completionRecords = [...(task.completionRecords || []), completionRecord];
    await task.save();
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get shared tasks
exports.getSharedTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Find tasks that are shared with this user's email
    const sharedTasks = await Task.find({
      'sharedWith.email': user.email
    });
    
    res.json(sharedTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};