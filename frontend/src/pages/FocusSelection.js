import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const FocusSelection = () => {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is not logged in, redirect to login
  if (!user) return <Navigate to="/login" />;
  
  const activeTasks = tasks.filter(task => !task.completed && !task.draft);
  
  const startFocusMode = (taskId) => {
    navigate(`/focus/${taskId}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Focus Mode</h1>
          <Link 
            to="/" 
            className="bg-white py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start mb-6">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Focus Mode</h2>
              <p className="text-gray-600">Select a task to enter focus mode. Focus mode helps you concentrate on a specific task by eliminating distractions and tracking your progress.</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading your tasks...</p>
            </div>
          ) : activeTasks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-600 mb-4">You don't have any active tasks to focus on.</p>
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                Create Your First Task
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select a task to focus on:</h3>
              
              {activeTasks.map(task => (
                <div 
                  key={task._id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => startFocusMode(task._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">{task.title}</h4>
                      {task.deadline && (
                        <p className="text-sm text-gray-500 mt-1">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-${getPriorityColor(task.importance)}-100 text-${getPriorityColor(task.importance)}-800`}>
                      {task.importance}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {task.lastTimeSpent ? `Last session: ${formatTime(task.lastTimeSpent)}` : 'No previous sessions'}
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition">
                      Start Focus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-900 mb-3">Benefits of Focus Mode</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-indigo-800">Improved concentration with timed sessions</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-indigo-800">Track time spent on each task</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-indigo-800">Structured breaks to maintain productivity</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-indigo-800">Add notes about your progress</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getPriorityColor = (importance) => {
  switch (importance) {
    case 5: return 'red';
    case 4: return 'orange';
    case 3: return 'yellow';
    case 2: return 'green';
    default: return 'blue';
  }
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export default FocusSelection; 