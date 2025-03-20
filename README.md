# TimeMaster - Time Management Application

![TimeMaster Logo](https://via.placeholder.com/150x50?text=TimeMaster)

TimeMaster is a comprehensive time management and productivity application designed to help users organize tasks, track time, and boost productivity through focused work sessions.

## Features

- **Task Management**: Create, edit, and delete tasks with customizable deadlines and importance levels
- **Focus Mode**: Dedicated distraction-free environment for working on specific tasks
- **Analytics**: Track productivity patterns and completed tasks
- **Collaboration**: Share and assign tasks with team members
- **Quick Add**: Rapidly add new tasks with auto-save functionality
- **User Authentication**: Secure login and registration system

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose for data storage
- JWT for authentication
- bcrypt for password hashing
- Cors for cross-origin requests

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas connection)

## Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/time-management-app.git
cd time-management-app
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:

```bash
npm start
```

The backend server will run on http://localhost:5001.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm start
```

The frontend development server will run on http://localhost:3000.

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
  - Body: `{ email, password, name }`
  - Returns: `{ token, user }`

- **POST /api/auth/login**: Login an existing user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- **GET /api/auth/me**: Get the current user profile
  - Header: `Authorization: Bearer <token>`
  - Returns: User data

### Tasks

- **GET /api/tasks**: Get all tasks for the current user
  - Header: `Authorization: Bearer <token>`
  - Returns: Array of tasks

- **POST /api/tasks**: Create a new task
  - Header: `Authorization: Bearer <token>`
  - Body: `{ title, description, deadline, importance }`
  - Returns: Created task

- **PUT /api/tasks/:id**: Update a task
  - Header: `Authorization: Bearer <token>`
  - Body: Task fields to update
  - Returns: Updated task

- **DELETE /api/tasks/:id**: Delete a task
  - Header: `Authorization: Bearer <token>`
  - Returns: Success message

- **POST /api/tasks/:id/complete**: Mark a task as complete
  - Header: `Authorization: Bearer <token>`
  - Returns: Updated task

- **POST /api/tasks/:id/share**: Share a task with another user
  - Header: `Authorization: Bearer <token>`
  - Body: `{ email }`
  - Returns: Updated task

- **POST /api/tasks/:id/focus**: Start a focus session
  - Header: `Authorization: Bearer <token>`
  - Returns: Updated task with focus session

## Project Structure

```
time-management-app/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   └── package.json         # Backend dependencies
│
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
│
└── README.md                # Project documentation
```

## Usage

1. **Registration & Login**: Create an account or login to access the dashboard
2. **Task Management**: Create tasks and assign deadlines and importance levels
3. **Focus Mode**: Select a task and use the timer to work in focused intervals
4. **Analytics**: View productivity trends and task completion statistics
5. **Collaboration**: Share tasks with team members by email

## Development

For development environment:

1. Backend: Run with `npm run dev` for hot reloading
2. Frontend: Already uses hot reloading with `npm start`

## License

[MIT License](LICENSE)

## Troubleshooting

### Common Issues

#### Backend Connection Issues

If the frontend cannot connect to the backend:

1. Ensure the backend server is running on port 5001
2. Check that the MongoDB connection string in `.env` is correct
3. Verify CORS is properly configured in the backend
4. Check network tab in browser developer tools for error details

#### Login Errors

If you encounter login or authentication issues:

1. Clear browser localStorage and try again
2. Ensure the JWT_SECRET in the backend `.env` file is properly set
3. Check that the user is properly registered in the database
4. Verify the token expiration time (default is 7 days)

#### Database Connection Issues

If you see MongoDB connection errors:

1. Check your internet connection if using MongoDB Atlas
2. Verify your MongoDB URI is correct in the `.env` file
3. Ensure IP whitelist settings in MongoDB Atlas include your IP
4. Try connecting to the database with MongoDB Compass to verify credentials

#### Development Mode Fallback

The application includes a development mode fallback for when the backend is not available or not responding:

1. In development mode, login with any email/password combination will work
2. Mock data will be used for tasks when API calls fail
3. This behavior only applies in development mode (not production)

For more help, please open an issue on GitHub with details about your problem.
