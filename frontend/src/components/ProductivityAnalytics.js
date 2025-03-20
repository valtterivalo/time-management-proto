import React, { useState, useEffect } from 'react';

const ProductivityAnalytics = ({ tasks }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeData, setTimeData] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  
  useEffect(() => {
    // Calculate analytics data when tasks change
    if (tasks && tasks.length > 0) {
      calculateAnalytics();
    }
  }, [tasks]);
  
  const calculateAnalytics = () => {
    // Calculate time spent on tasks
    const completedTasks = tasks.filter(task => task.completed);
    const totalTimeSpent = completedTasks.reduce((total, task) => {
      const taskTime = task.completionRecords 
        ? task.completionRecords.reduce((sum, record) => sum + (record.timeSpent || 0), 0)
        : 0;
      return total + taskTime;
    }, 0);
    
    // Average time per completed task
    const avgTimePerTask = completedTasks.length > 0 
      ? Math.round(totalTimeSpent / completedTasks.length) 
      : 0;
    
    // Calculate completion data
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);
    
    const completedLast7Days = completedTasks.filter(task => {
      const completedAt = task.completionRecords && task.completionRecords.length > 0
        ? new Date(task.completionRecords[task.completionRecords.length - 1].completedAt)
        : null;
      return completedAt && completedAt >= last7Days;
    });
    
    // Group completions by day of week
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const completionsByDay = dayNames.map(day => ({ day, count: 0 }));
    
    completedLast7Days.forEach(task => {
      const completedAt = new Date(task.completionRecords[task.completionRecords.length - 1].completedAt);
      const dayOfWeek = completedAt.getDay();
      completionsByDay[dayOfWeek].count += 1;
    });
    
    // Calculate completion rate
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks.length / totalTasks) * 100) 
      : 0;
    
    // Calculate most productive time
    let morningCount = 0;
    let afternoonCount = 0;
    let eveningCount = 0;
    
    completedTasks.forEach(task => {
      if (task.completionRecords && task.completionRecords.length > 0) {
        const completedAt = new Date(task.completionRecords[task.completionRecords.length - 1].completedAt);
        const hour = completedAt.getHours();
        
        if (hour >= 5 && hour < 12) morningCount++;
        else if (hour >= 12 && hour < 17) afternoonCount++;
        else eveningCount++;
      }
    });
    
    const mostProductiveTime = 
      morningCount >= afternoonCount && morningCount >= eveningCount
        ? 'Morning (5am-12pm)'
        : afternoonCount >= morningCount && afternoonCount >= eveningCount
          ? 'Afternoon (12pm-5pm)'
          : 'Evening (5pm-5am)';
    
    // Set the data
    setTimeData({
      totalTimeSpent,
      avgTimePerTask,
      completedTasks: completedTasks.length,
      overdueTasks: tasks.filter(task => 
        !task.completed && task.deadline && new Date(task.deadline) < now
      ).length
    });
    
    setCompletionData({
      completionRate,
      completionsByDay,
      mostProductiveTime,
      highPriorityCompleted: completedTasks.filter(task => task.importance >= 4).length,
    });
  };
  
  const formatTime = (seconds) => {
    if (!seconds) return '0 min';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Productivity Analytics</h3>
      
      <div className="mb-4 border-b">
        <div className="flex">
          <button 
            className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'time' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('time')}
          >
            Time Analysis
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'completion' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('completion')}
          >
            Completion
          </button>
        </div>
      </div>
      
      {!timeData && (
        <div className="py-8 text-center text-gray-500">
          {tasks.length === 0 
            ? "Add and complete tasks to see your analytics"
            : "Loading analytics..."}
        </div>
      )}
      
      {timeData && activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm text-blue-700 font-medium">Completion Rate</h4>
            <div className="mt-2">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${completionData.completionRate}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-blue-800 font-bold">{completionData.completionRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm text-green-700 font-medium">Total Time Invested</h4>
            <p className="mt-2 text-xl font-bold text-green-800">{formatTime(timeData.totalTimeSpent)}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm text-purple-700 font-medium">Most Productive Time</h4>
            <p className="mt-2 text-lg font-bold text-purple-800">{completionData.mostProductiveTime}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm text-yellow-700 font-medium">Tasks Completed</h4>
            <p className="mt-2 text-xl font-bold text-yellow-800">{timeData.completedTasks}</p>
            <p className="text-xs text-yellow-600">{completionData.highPriorityCompleted} high priority</p>
          </div>
        </div>
      )}
      
      {timeData && activeTab === 'time' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Average Time per Task</h4>
            <p className="text-2xl font-bold text-indigo-700">{formatTime(timeData.avgTimePerTask)}</p>
          </div>
          
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Total time tracked</td>
                  <td className="py-2 font-medium text-right">{formatTime(timeData.totalTimeSpent)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Completed tasks</td>
                  <td className="py-2 font-medium text-right">{timeData.completedTasks}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Overdue tasks</td>
                  <td className="py-2 font-medium text-right text-red-600">{timeData.overdueTasks}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Task Completion Tips</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Track all your work to get accurate insights</li>
              <li>• Break down large tasks into smaller ones</li>
              <li>• Schedule tasks during your most productive time</li>
            </ul>
          </div>
        </div>
      )}
      
      {timeData && activeTab === 'completion' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Task Completion</h4>
            <div className="flex items-end h-32 space-x-2">
              {completionData.completionsByDay.map((day, index) => {
                const maxCount = Math.max(...completionData.completionsByDay.map(d => d.count));
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-indigo-200 rounded-t"
                      style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">{day.day}</div>
                    <div className="text-xs font-medium">{day.count}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Your Insights</h4>
            <div className="space-y-3 text-sm text-gray-700">
              {completionData.completionRate < 50 && (
                <p>
                  Your current completion rate is {completionData.completionRate}%. 
                  Try focusing on fewer tasks at a time for better results.
                </p>
              )}
              
              {completionData.completionRate >= 50 && completionData.completionRate < 80 && (
                <p>
                  Your completion rate of {completionData.completionRate}% is good! 
                  Keep building consistent habits to improve further.
                </p>
              )}
              
              {completionData.completionRate >= 80 && (
                <p>
                  Impressive completion rate of {completionData.completionRate}%! 
                  You're doing an excellent job at following through.
                </p>
              )}
              
              <p>
                Your most productive time is during the {completionData.mostProductiveTime.toLowerCase()}.
                Try to schedule your important tasks during this period.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityAnalytics; 