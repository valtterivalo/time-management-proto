import React from 'react';
import TaskCard from './TaskCard';
import CollaborativeTask from './CollaborativeTask';

const TaskList = ({ tasks, onShare, onAssign, onComment, showCollaborative = false }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500 italic p-4 text-center">No tasks available</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="task-container">
          <TaskCard task={task} />
          {showCollaborative && (
            <CollaborativeTask 
              task={task} 
              onShare={onShare}
              onAssign={onAssign}
              onComment={onComment}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;