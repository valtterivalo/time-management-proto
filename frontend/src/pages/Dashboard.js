import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import QuickAddForm from '../components/QuickAddForm';
import TaskAssistant from '../components/TaskAssistant';
import ProductivityAnalytics from '../components/ProductivityAnalytics';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, shareTask, assignTask, addComment } = useTasks();
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  if (!user) return <Navigate to="/login" />;

  // Filter tasks
  const completedTasks = tasks.filter(task => task.completed && !task.draft);
  const activeTasks = tasks.filter(task => !task.completed && !task.draft);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.name || (user.email ? user.email.split('@')[0] : 'User')}
          </h1>
          <p className="text-gray-600">
            Here's your productivity dashboard for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/4">
            {/* Analytics Toggle Button */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Tasks
              </h2>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition bg-white py-2 px-4 rounded-md shadow-sm hover:shadow border border-indigo-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            </div>
            
            {/* Analytics Section */}
            {showAnalytics && (
              <div className="mb-8 animate-fadeIn">
                <ProductivityAnalytics tasks={tasks} />
              </div>
            )}
            
            {/* Task Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-indigo-50">
                <div className="text-indigo-500 text-sm font-medium mb-1">Active Tasks</div>
                <div className="text-3xl font-bold">{activeTasks.length}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-green-50">
                <div className="text-green-500 text-sm font-medium mb-1">Completed</div>
                <div className="text-3xl font-bold">{completedTasks.length}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-50">
                <div className="text-purple-500 text-sm font-medium mb-1">Total Tasks</div>
                <div className="text-3xl font-bold">{tasks.filter(t => !t.draft).length}</div>
              </div>
            </div>
            
            {/* Active Tasks Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Active Tasks
              </h3>
              
              {activeTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>You don't have any active tasks. Create a new task to get started!</p>
                </div>
              ) : (
                <TaskList 
                  tasks={activeTasks} 
                  onShare={shareTask}
                  onAssign={assignTask}
                  onComment={addComment}
                  showCollaborative={true}
                />
              )}
            </div>
            
            {/* Completed Tasks Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <details className="group">
                <summary className="list-none flex items-center justify-between cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Completed Tasks
                  </h3>
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                      {completedTasks.length}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-gray-500 group-open:transform group-open:rotate-180 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                
                <div className="mt-4">
                  {completedTasks.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">
                      You haven't completed any tasks yet.
                    </p>
                  ) : (
                    <TaskList tasks={completedTasks} />
                  )}
                </div>
              </details>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="md:w-1/4">
            <div className="sticky top-6">
              {/* Task Assistant */}
              <div className="mb-6">
                <TaskAssistant tasks={tasks} />
              </div>
              
              {/* Quick Tips Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">Productivity Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5">1</span>
                    <div>
                      <p className="font-medium text-indigo-900">Use Focus Mode</p>
                      <p className="text-sm text-indigo-700">Enhance concentration on individual tasks</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5">2</span>
                    <div>
                      <p className="font-medium text-indigo-900">Set Priorities</p>
                      <p className="text-sm text-indigo-700">Assign importance levels from 1-5</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5">3</span>
                    <div>
                      <p className="font-medium text-indigo-900">Collaborate</p>
                      <p className="text-sm text-indigo-700">Share tasks with team members</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5">4</span>
                    <div>
                      <p className="font-medium text-indigo-900">Track Analytics</p>
                      <p className="text-sm text-indigo-700">Monitor your productivity patterns</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <QuickAddForm />
    </div>
  );
};

export default Dashboard;