import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';

const FocusMode = () => {
  const { taskId } = useParams();
  const { tasks, updateTask } = useTasks();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [breakMode, setBreakMode] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find(t => t._id === taskId);
      if (foundTask) {
        setTask(foundTask);
        setNotes(foundTask.notes || '');
      } else {
        navigate('/');
      }
    }
  }, [tasks, taskId, navigate]);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && !breakMode) {
      interval = setInterval(() => {
        setTimeElapsed(seconds => seconds + 1);
      }, 1000);
    } else if (isActive && breakMode) {
      interval = setInterval(() => {
        setBreakTime(seconds => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, breakMode]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const startBreak = () => {
    setIsActive(true);
    setBreakMode(true);
    setBreakTime(0);
  };
  
  const endBreak = () => {
    setBreakMode(false);
    setIsActive(true);
  };
  
  const completeTask = async () => {
    if (task) {
      // Create a completion record
      const completion = {
        timeSpent: timeElapsed,
        completedAt: new Date(),
        notes: notes
      };
      
      await updateTask({
        ...task,
        completed: true,
        notes: notes,
        completionRecords: [...(task.completionRecords || []), completion]
      });
      
      navigate('/');
    }
  };
  
  const saveProgress = async () => {
    if (task) {
      await updateTask({
        ...task,
        notes: notes,
        lastTimeSpent: timeElapsed
      });
    }
  };
  
  if (!task) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  return (
    <div className="min-h-screen bg-gray-50 pt-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </button>
          {!isActive && !breakMode && (
            <button 
              onClick={saveProgress} 
              className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
            >
              Save Progress
            </button>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
            <div className="flex items-center mt-2">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getImportanceColor(task.importance)}`}></span>
              <span className="text-sm text-gray-600">Priority: {task.importance}/5</span>
              {task.deadline && (
                <span className="ml-4 text-sm text-gray-600">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 flex flex-col items-center">
            <div className="text-6xl font-mono font-bold mb-6 text-indigo-700">
              {formatTime(timeElapsed)}
            </div>
            
            {breakMode ? (
              <div className="w-full text-center">
                <div className="text-xl mb-2 text-green-600">Break Time: {formatTime(breakTime)}</div>
                <button 
                  onClick={endBreak} 
                  className="bg-green-500 text-white py-2 px-6 rounded-full text-lg hover:bg-green-600"
                >
                  End Break
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={toggleTimer} 
                  className={`py-3 px-8 rounded-full text-lg ${
                    isActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isActive ? 'Pause' : 'Start Focus'}
                </button>
                
                {isActive && (
                  <button 
                    onClick={startBreak} 
                    className="bg-green-500 text-white py-3 px-8 rounded-full text-lg hover:bg-green-600"
                  >
                    Take a Break
                  </button>
                )}
                
                <button 
                  onClick={completeTask} 
                  className="bg-purple-500 text-white py-3 px-8 rounded-full text-lg hover:bg-purple-600"
                >
                  Complete Task
                </button>
              </div>
            )}
            
            <div className="mt-8 mb-2 w-full">
              <button 
                onClick={() => setShowNotes(!showNotes)} 
                className="flex items-center justify-between w-full text-left p-3 rounded bg-gray-100 hover:bg-gray-200"
              >
                <span className="font-medium">Task Notes</span>
                <span>{showNotes ? '↑' : '↓'}</span>
              </button>
              
              {showNotes && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add notes about your progress..."
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 bg-indigo-50">
            <h3 className="font-medium text-indigo-800 mb-2">Focus Tips</h3>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Set a clear intention for this focus session</li>
              <li>• Put your phone in do-not-disturb mode</li>
              <li>• Take a short break every 25 minutes</li>
              <li>• Stay hydrated and maintain good posture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const getImportanceColor = (importance) => {
  const colors = [
    "bg-gray-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
  ];
  return colors[importance - 1] || colors[0];
};

export default FocusMode; 