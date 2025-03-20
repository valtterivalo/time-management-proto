import React, { useState } from 'react';

const CollaborativeTask = ({ task, onShare, onAssign, onComment }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  const handleShare = () => {
    if (email.trim()) {
      onShare(task._id, email.trim());
      setEmail('');
      setShowShareOptions(false);
    }
  };
  
  const handleAddComment = () => {
    if (comment.trim()) {
      onComment(task._id, comment.trim());
      setComment('');
    }
  };
  
  return (
    <div className="border-t pt-3 mt-2">
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-xs text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          {task.comments?.length || 0} Comments
        </button>
        
        {task.shared && task.sharedWith && (
          <div className="ml-auto flex space-x-1">
            {task.sharedWith.map((user, index) => (
              <div 
                key={index}
                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700"
                title={user.email}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {showShareOptions && (
        <div className="mt-3 p-3 bg-blue-50 rounded">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Share this task</h4>
          <div className="flex mb-2">
            <input
              type="email"
              className="flex-1 p-1.5 text-sm border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleShare}
              className="bg-blue-600 text-white px-3 rounded-r hover:bg-blue-700 text-sm"
            >
              Share
            </button>
          </div>
          
          <div className="text-xs text-blue-700">
            Team members will be able to view and comment on this task.
          </div>
          
          {task.shared && task.sharedWith && task.sharedWith.length > 0 && (
            <div className="mt-3">
              <h5 className="text-xs font-medium text-blue-800 mb-1">Currently shared with:</h5>
              <ul className="text-xs text-blue-700">
                {task.sharedWith.map((user, index) => (
                  <li key={index} className="flex items-center justify-between py-1">
                    <span>{user.email}</span>
                    <button 
                      onClick={() => onAssign(task._id, user.email)}
                      className={`text-xs px-2 py-0.5 rounded ${user.isAssigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      {user.isAssigned ? 'Assigned' : 'Assign'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {showComments && (
        <div className="mt-3">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Comments</h4>
          
          {task.comments && task.comments.length > 0 ? (
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {task.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{comment.author}</span>
                    <span className="text-gray-500 text-xxs">{new Date(comment.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 mb-2">No comments yet</p>
          )}
          
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-1.5 text-sm border rounded-l focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="bg-gray-600 text-white px-3 rounded-r hover:bg-gray-700 text-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeTask; 