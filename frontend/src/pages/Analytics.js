import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Analytics = () => {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  
  // If user is not logged in, redirect to login
  if (!user) return <Navigate to="/login" />;
  
  useEffect(() => {
    if (!loading && tasks.length > 0) {
      calculateAnalytics();
    }
  }, [tasks, loading]);
  
  const calculateAnalytics = () => {
    // Filter out draft tasks
    const nonDraftTasks = tasks.filter(task => !task.draft);
    
    // Completion rate
    const completedTasks = nonDraftTasks.filter(task => task.completed);
    const completionRate = nonDraftTasks.length > 0 
      ? (completedTasks.length / nonDraftTasks.length * 100).toFixed(0)
      : 0;
      
    // Tasks by priority
    const tasksByPriority = [0, 0, 0, 0, 0]; // Index 0-4 for priorities 1-5
    nonDraftTasks.forEach(task => {
      if (task.importance >= 1 && task.importance <= 5) {
        tasksByPriority[task.importance - 1]++;
      }
    });
    
    // Focus time data
    let totalFocusTime = 0;
    let focusSessionsCount = 0;
    
    nonDraftTasks.forEach(task => {
      if (task.focusSessions && task.focusSessions.length > 0) {
        focusSessionsCount += task.focusSessions.length;
        
        task.focusSessions.forEach(session => {
          if (session.duration) {
            totalFocusTime += session.duration;
          }
        });
      }
      
      // Also count lastTimeSpent if available
      if (task.lastTimeSpent) {
        totalFocusTime += task.lastTimeSpent;
      }
    });
    
    // Tasks by completion time
    const completionTimeRanges = {
      fast: 0, // < 30 mins
      medium: 0, // 30 mins - 2 hours
      long: 0 // > 2 hours
    };
    
    completedTasks.forEach(task => {
      let timeSpent = 0;
      
      if (task.completionRecords && task.completionRecords.length > 0) {
        task.completionRecords.forEach(record => {
          if (record.timeSpent) {
            timeSpent += record.timeSpent;
          }
        });
      }
      
      if (timeSpent < 1800) { // less than 30 mins
        completionTimeRanges.fast++;
      } else if (timeSpent < 7200) { // less than 2 hours
        completionTimeRanges.medium++;
      } else {
        completionTimeRanges.long++;
      }
    });
    
    // Recent activity
    const recentActivity = [...nonDraftTasks]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map(task => ({
        id: task._id,
        title: task.title,
        status: task.completed ? 'completed' : 'active',
        date: new Date(task.updatedAt).toLocaleDateString()
      }));
    
    setAnalytics({
      totalTasks: nonDraftTasks.length,
      completedTasks: completedTasks.length,
      completionRate,
      tasksByPriority,
      totalFocusTime,
      focusSessionsCount,
      completionTimeRanges,
      recentActivity
    });
  };
  
  // Format time from seconds to hours and minutes
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Productivity Analytics</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading your analytics...</p>
          </div>
        ) : !analytics ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 mb-4">No analytics available yet. Create and complete some tasks to see your productivity data.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-indigo-500">
                <div className="text-gray-500 text-sm font-medium">Total Tasks</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalTasks}</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-green-500">
                <div className="text-gray-500 text-sm font-medium">Completed</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{analytics.completedTasks}</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-purple-500">
                <div className="text-gray-500 text-sm font-medium">Completion Rate</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{analytics.completionRate}%</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-blue-500">
                <div className="text-gray-500 text-sm font-medium">Focus Time</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{formatTime(analytics.totalFocusTime)}</div>
              </div>
            </div>
            
            {/* Tasks by Priority */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks by Priority</h2>
              <div className="space-y-3">
                {analytics.tasksByPriority.map((count, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600">Priority {index + 1}</div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full h-4 w-full">
                        <div 
                          className={`h-4 rounded-full ${getPriorityColor(index + 1)}`} 
                          style={{ width: `${count / Math.max(...analytics.tasksByPriority) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm text-gray-600">{count}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Completion Time Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Completion Time</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <div className="flex-1 text-sm text-gray-600">Quick (&lt;30 min)</div>
                    <div className="text-sm font-medium text-gray-800">{analytics.completionTimeRanges.fast}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="flex-1 text-sm text-gray-600">Medium (30 min - 2h)</div>
                    <div className="text-sm font-medium text-gray-800">{analytics.completionTimeRanges.medium}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <div className="flex-1 text-sm text-gray-600">Long (&gt;2h)</div>
                    <div className="text-sm font-medium text-gray-800">{analytics.completionTimeRanges.long}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Focus Sessions:</span> {analytics.focusSessionsCount}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Avg. Session Time:</span> {
                      analytics.focusSessionsCount > 0 
                        ? formatTime(Math.floor(analytics.totalFocusTime / analytics.focusSessionsCount))
                        : '0m'
                    }
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                
                {analytics.recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className={`w-3 h-3 rounded-full mr-3 ${activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800 truncate">{activity.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {activity.status === 'completed' ? 'Completed' : 'Updated'} on {activity.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Productivity Tips */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">Productivity Insights</h2>
              <div className="space-y-4">
                {analytics.completionRate < 50 && (
                  <div className="bg-white rounded-md p-4 border-l-4 border-orange-500">
                    <div className="font-medium text-gray-800">Low Completion Rate</div>
                    <p className="text-sm text-gray-600 mt-1">Your completion rate is below 50%. Try breaking down tasks into smaller, more manageable pieces.</p>
                  </div>
                )}
                
                {analytics.completionRate >= 80 && (
                  <div className="bg-white rounded-md p-4 border-l-4 border-green-500">
                    <div className="font-medium text-gray-800">Great Completion Rate!</div>
                    <p className="text-sm text-gray-600 mt-1">Your completion rate is above 80%. Keep up the good work!</p>
                  </div>
                )}
                
                {analytics.tasksByPriority[4] > analytics.tasksByPriority[0] + analytics.tasksByPriority[1] && (
                  <div className="bg-white rounded-md p-4 border-l-4 border-red-500">
                    <div className="font-medium text-gray-800">High Priority Overload</div>
                    <p className="text-sm text-gray-600 mt-1">You have many high priority tasks. Consider delegating or rescheduling some tasks.</p>
                  </div>
                )}
                
                {analytics.totalFocusTime === 0 && (
                  <div className="bg-white rounded-md p-4 border-l-4 border-blue-500">
                    <div className="font-medium text-gray-800">Try Focus Mode</div>
                    <p className="text-sm text-gray-600 mt-1">You haven't used focus mode yet. It can help improve your concentration and productivity.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for priority color classes
const getPriorityColor = (priority) => {
  switch (priority) {
    case 1: return 'bg-blue-500';
    case 2: return 'bg-green-500';
    case 3: return 'bg-yellow-500';
    case 4: return 'bg-orange-500';
    case 5: return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default Analytics; 