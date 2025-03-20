import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5001/api';

// Mock data to simulate server response for development/fallback
const mockTasks = [
  {
    _id: 'task1',
    title: 'Complete project proposal',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    importance: 4,
    completed: false,
    draft: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'task2',
    title: 'Review team progress',
    deadline: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    importance: 3,
    completed: false,
    draft: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'task3',
    title: 'Update documentation',
    deadline: new Date(Date.now() - 86400000).toISOString(), // 1 day ago (overdue)
    importance: 2,
    completed: true,
    draft: false,
    createdAt: new Date().toISOString()
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  
  // Create an axios instance with auth header
  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.get('/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks');
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data as fallback');
        setTasks(mockTasks);
      }
      
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post('/tasks', taskData);
      setTasks(prevTasks => [...prevTasks, res.data]);
      return res.data;
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const mockTask = {
          _id: 'task_' + Date.now(),
          ...taskData,
          userId: user?.id || 'mock_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setTasks(prevTasks => [...prevTasks, mockTask]);
        return mockTask;
      }
      
      return null;
    }
  };

  const updateTask = async (taskData) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.put(`/tasks/${taskData._id}`, taskData);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskData._id ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const updatedTask = {
          ...taskData,
          updatedAt: new Date().toISOString()
        };
        setTasks(prevTasks => 
          prevTasks.map(task => task._id === taskData._id ? updatedTask : task)
        );
        return updatedTask;
      }
      
      return null;
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      const authAxios = getAuthAxios();
      await authAxios.delete(`/tasks/${taskId}`);
      
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        return true;
      }
      
      return false;
    }
  };
  
  // Collaborative features
  
  const shareTask = async (taskId, email) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/tasks/${taskId}/share`, { email });
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error sharing task:', err);
      setError('Failed to share task');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return null;
        
        const updatedTask = {
          ...task,
          shared: true,
          sharedWith: [
            ...(task.sharedWith || []),
            { email, isAssigned: false }
          ]
        };
        
        // Filter out duplicates
        updatedTask.sharedWith = updatedTask.sharedWith.filter((item, index, self) => 
          index === self.findIndex(t => t.email === item.email)
        );
        
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? updatedTask : t)
        );
        
        return updatedTask;
      }
      
      return null;
    }
  };
  
  const assignTask = async (taskId, email) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/tasks/${taskId}/assign`, { email });
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error assigning task:', err);
      setError('Failed to assign task');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const task = tasks.find(t => t._id === taskId);
        if (!task || !task.sharedWith) return null;
        
        const updatedSharedWith = task.sharedWith.map(user => {
          if (user.email === email) {
            return { 
              ...user, 
              isAssigned: !user.isAssigned, 
              assignedAt: user.isAssigned ? null : new Date() 
            };
          }
          return user;
        });
        
        const updatedTask = {
          ...task,
          sharedWith: updatedSharedWith
        };
        
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? updatedTask : t)
        );
        
        return updatedTask;
      }
      
      return null;
    }
  };
  
  const addComment = async (taskId, commentText) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/tasks/${taskId}/comment`, { text: commentText });
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return null;
        
        const newComment = {
          author: user?.email || 'Anonymous',
          text: commentText,
          timestamp: new Date()
        };
        
        const updatedTask = {
          ...task,
          comments: [...(task.comments || []), newComment]
        };
        
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? updatedTask : t)
        );
        
        return updatedTask;
      }
      
      return null;
    }
  };
  
  // Focus mode tracking
  
  const startFocusSession = async (taskId) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/tasks/${taskId}/focus/start`);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error starting focus session:', err);
      setError('Failed to start focus session');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return null;
        
        const newSession = {
          startTime: new Date(),
          breaks: []
        };
        
        const updatedTask = {
          ...task,
          focusSessions: [...(task.focusSessions || []), newSession]
        };
        
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? updatedTask : t)
        );
        
        return updatedTask;
      }
      
      return null;
    }
  };
  
  const endFocusSession = async (taskId, timeSpent) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/tasks/${taskId}/focus/end`, { duration: timeSpent });
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error ending focus session:', err);
      setError('Failed to end focus session');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const task = tasks.find(t => t._id === taskId);
        if (!task || !task.focusSessions || task.focusSessions.length === 0) return null;
        
        // Get the latest session and update it
        const updatedSessions = [...task.focusSessions];
        const latestSession = updatedSessions[updatedSessions.length - 1];
        
        updatedSessions[updatedSessions.length - 1] = {
          ...latestSession,
          endTime: new Date(),
          duration: timeSpent
        };
        
        const updatedTask = {
          ...task,
          focusSessions: updatedSessions,
          lastTimeSpent: timeSpent
        };
        
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? updatedTask : t)
        );
        
        return updatedTask;
      }
      
      return null;
    }
  };
  
  const recordBreak = async (taskId, breakData) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/tasks/${taskId}/focus/break`, breakData);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error recording break:', err);
      setError('Failed to record break');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const task = tasks.find(t => t._id === taskId);
        if (!task || !task.focusSessions || task.focusSessions.length === 0) return null;
        
        // Add break to the latest focus session
        const updatedSessions = [...task.focusSessions];
        const lastSessionIndex = updatedSessions.length - 1;
        
        if (!updatedSessions[lastSessionIndex].breaks) {
          updatedSessions[lastSessionIndex].breaks = [];
        }
        
        updatedSessions[lastSessionIndex].breaks.push(breakData);
        
        const updatedTask = {
          ...task,
          focusSessions: updatedSessions
        };
        
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? updatedTask : t)
        );
        
        return updatedTask;
      }
      
      return null;
    }
  };
  
  const completeTask = async (taskId, completionData = {}) => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/tasks/${taskId}/complete`, completionData);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? res.data : task)
      );
      return res.data;
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to complete task');
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return null;
        
        const completionRecord = {
          timeSpent: completionData.timeSpent || 0,
          completedAt: new Date(),
          notes: completionData.notes || ''
        };
        
        const updatedTask = {
          ...task,
          completed: true,
          completionRecords: [...(task.completionRecords || []), completionRecord]
        };
        
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? updatedTask : t)
        );
        
        return updatedTask;
      }
      
      return null;
    }
  };
  
  // Fetch shared tasks
  const fetchSharedTasks = async () => {
    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.get('/tasks/shared');
      return res.data;
    } catch (err) {
      console.error('Error fetching shared tasks:', err);
      setError('Failed to fetch shared tasks');
      return [];
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    shareTask,
    assignTask,
    addComment,
    startFocusSession,
    endFocusSession,
    recordBreak,
    completeTask,
    fetchSharedTasks
  };
};