import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskAssistant = ({ tasks }) => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const generateSuggestions = async () => {
    setLoading(true);
    
    // This would connect to a backend AI service in production
    // For now, we'll simulate the AI response
    setTimeout(() => {
      const prioritizedTasks = [...tasks]
        .filter(task => !task.completed)
        .sort((a, b) => {
          // Calculate priority score based on deadline and importance
          const scoreA = (a.importance * 10) + (a.deadline ? (new Date(a.deadline) - new Date()) / 86400000 : 30);
          const scoreB = (b.importance * 10) + (b.deadline ? (new Date(b.deadline) - new Date()) / 86400000 : 30);
          return scoreA - scoreB;
        })
        .slice(0, 5);
      
      const timeBlocks = prioritizedTasks.map(task => ({
        task: task.title,
        suggestedTime: task.importance * 25, // Suggest time blocks based on importance (in minutes)
        startTime: null, // Will be set when user starts focus mode
      }));
      
      setSuggestions({
        prioritizedTasks,
        timeBlocks,
        dailyTip: getRandomTip(),
      });
      
      setLoading(false);
    }, 1500);
  };
  
  const startFocusMode = (taskId) => {
    navigate(`/focus/${taskId}`);
  };
  
  const getRandomTip = () => {
    const tips = [
      "Try the Pomodoro Technique: 25 minutes of focus followed by a 5-minute break.",
      "Tackle your most important task first thing in the morning.",
      "Break large tasks into smaller, manageable chunks.",
      "Set specific goals for each work session.",
      "Minimize distractions by turning off notifications during focus time."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Assistant</h3>
      
      {!suggestions && !loading && (
        <button 
          onClick={generateSuggestions}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
        >
          Generate Smart Suggestions
        </button>
      )}
      
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Analyzing your tasks...</span>
        </div>
      )}
      
      {suggestions && !loading && (
        <div>
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Suggested Priority</h4>
            <ul className="space-y-2">
              {suggestions.prioritizedTasks.map((task) => (
                <li key={task._id} className="flex items-center justify-between">
                  <div>
                    <span className={`inline-block w-5 h-5 rounded-full mr-2 ${getImportanceColor(task.importance)}`}></span>
                    <span>{task.title}</span>
                  </div>
                  <button 
                    onClick={() => startFocusMode(task._id)}
                    className="text-sm bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                  >
                    Focus
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Suggested Time Blocks</h4>
            <ul className="space-y-2">
              {suggestions.timeBlocks.map((block, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span>{block.task}</span>
                  <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded">
                    {block.suggestedTime} min
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-100">
            <h4 className="font-medium text-yellow-800 mb-1">Daily Productivity Tip</h4>
            <p className="text-sm text-yellow-700">{suggestions.dailyTip}</p>
          </div>
          
          <button 
            onClick={() => setSuggestions(null)}
            className="mt-4 w-full border border-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-100 transition duration-200"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

const getImportanceColor = (importance) => {
  const colors = [
    "bg-gray-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-red-200",
  ];
  return colors[importance - 1] || colors[0];
};

export default TaskAssistant; 