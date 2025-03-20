import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskCard = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState(task.deadline ? task.deadline.slice(0, 10) : '');
  const [importance, setImportance] = useState(task.importance);

  const handleSave = () => {
    updateTask({
      ...task,
      title,
      deadline,
      importance
    });
    setIsEditing(false);
  };

  const toggleComplete = () => {
    updateTask({
      ...task,
      completed: !task.completed
    });
  };

  // Get color based on importance
  const getImportanceColor = () => {
    const colors = [
      'border-gray-200',
      'border-blue-200',
      'border-green-200',
      'border-yellow-200',
      'border-red-200'
    ];
    return colors[task.importance - 1] || colors[0];
  };

  // Format deadline to show relative time
  const formatDeadline = () => {
    if (!task.deadline) return null;
    
    const deadline = new Date(task.deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-red-600 font-medium">Overdue by {Math.abs(diffDays)} days</span>;
    } else if (diffDays === 0) {
      return <span className="text-orange-600 font-medium">Due today</span>;
    } else if (diffDays === 1) {
      return <span className="text-orange-500 font-medium">Due tomorrow</span>;
    } else if (diffDays <= 7) {
      return <span className="text-yellow-600">Due in {diffDays} days</span>;
    } else {
      return <span className="text-gray-600">Due on {deadline.toLocaleDateString()}</span>;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${task.completed ? 'opacity-80' : ''}`}>
      <div className={`w-full h-1 ${getImportanceColor().replace('border', 'bg')}`}></div>
      
      {isEditing ? (
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Edit Task</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority (1-5)</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setImportance(num)}
                    className={`w-8 h-8 rounded-full ${
                      importance === num 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              
              {task.deadline && (
                <div className="mt-2 text-sm">
                  {formatDeadline()}
                </div>
              )}
            </div>
            
            <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium ${
              task.importance >= 4 ? 'text-red-700' : 
              task.importance >= 3 ? 'text-yellow-700' : 
              task.importance >= 2 ? 'text-green-700' : 'text-blue-700'
            }`}>
              {task.importance}
            </div>
          </div>
          
          <div className="mt-5 flex items-center space-x-2">
            <button
              onClick={toggleComplete}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition ${
                task.completed
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 mr-1 ${task.completed ? 'text-gray-500' : 'text-green-500'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {task.completed ? 'Completed' : 'Complete'}
            </button>
            
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1 text-blue-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            
            <button
              onClick={() => deleteTask(task._id)}
              className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 transition"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;