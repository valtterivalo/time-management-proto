import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';

const QuickAddForm = () => {
  const { addTask } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [importance, setImportance] = useState(1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  useEffect(() => {
    if (title) {
      setIsAutoSaving(true);
      const timer = setTimeout(() => {
        addTask({ title, deadline, importance, draft: true });
        setIsAutoSaving(false);
      }, 1000); // Auto-save after 1 second of inactivity
      return () => {
        clearTimeout(timer);
        setIsAutoSaving(false);
      };
    }
  }, [title, deadline, importance, addTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addTask({ title, deadline, importance, draft: false });
    setTitle('');
    setDeadline('');
    setImportance(1);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        aria-label="Add new task"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg shadow-2xl p-0 w-full max-w-md mx-4 transform transition-all duration-300 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">New Task</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    autoFocus
                  />
                  {isAutoSaving && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving draft...
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline (Optional)
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setImportance(num)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          importance === num
                            ? `${getButtonColor(num)} text-white`
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-center">
                    {getPriorityDescription(importance)}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center font-medium"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to get button color based on importance
const getButtonColor = (importance) => {
  const colors = [
    'bg-blue-500', // 1 - Low priority
    'bg-green-500', // 2
    'bg-yellow-500', // 3
    'bg-orange-500', // 4
    'bg-red-500', // 5 - High priority
  ];
  return colors[importance - 1] || colors[0];
};

// Helper function to get priority description
const getPriorityDescription = (importance) => {
  const descriptions = [
    'Low Priority',
    'Normal Priority',
    'Medium Priority',
    'Important',
    'Urgent'
  ];
  return descriptions[importance - 1] || descriptions[0];
};

export default QuickAddForm;