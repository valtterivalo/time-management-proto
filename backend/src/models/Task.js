const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  importance: { type: Number, min: 1, max: 5, default: 1 },
  completed: { type: Boolean, default: false },
  draft: { type: Boolean, default: false }, // For auto-save drafts
  
  // New fields for enhanced features
  
  // Time tracking
  timeEstimate: { type: Number }, // Estimated time in seconds
  lastTimeSpent: { type: Number, default: 0 }, // Time spent in seconds (for saved progress)
  
  // Completion records for analytics
  completionRecords: [{
    timeSpent: { type: Number }, // Time spent in seconds
    completedAt: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  
  // Collaborative features
  shared: { type: Boolean, default: false },
  sharedWith: [{
    email: { type: String },
    isAssigned: { type: Boolean, default: false },
    assignedAt: { type: Date }
  }],
  
  // Comments
  comments: [{
    author: { type: String },
    text: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // General notes
  notes: { type: String },
  
  // Tags for categorization
  tags: [{ type: String }],
  
  // Recurring task
  recurring: { type: Boolean, default: false },
  recurringPattern: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    interval: { type: Number, default: 1 } // every X days/weeks/months
  },
  
  // Focus sessions
  focusSessions: [{
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number }, // in seconds
    breaks: [{
      startTime: { type: Date },
      endTime: { type: Date },
      duration: { type: Number } // in seconds
    }]
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update the 'updatedAt' field
TaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Task', TaskSchema);