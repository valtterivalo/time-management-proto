const express = require('express');
const { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  startFocusSession,
  endFocusSession,
  recordBreak,
  shareTask,
  assignTask,
  addComment,
  completeTask,
  getSharedTasks
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Basic task operations
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Focus mode operations
router.post('/:taskId/focus/start', startFocusSession);
router.post('/:taskId/focus/end', endFocusSession);
router.post('/:taskId/focus/break', recordBreak);

// Collaboration operations
router.post('/:taskId/share', shareTask);
router.post('/:taskId/assign', assignTask);
router.post('/:taskId/comment', addComment);
router.post('/:taskId/complete', completeTask);

// Shared tasks
router.get('/shared', getSharedTasks);

module.exports = router;