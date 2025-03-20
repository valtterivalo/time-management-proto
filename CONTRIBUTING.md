# Contributing to TimeMaster

Thank you for your interest in contributing to TimeMaster! This document provides guidelines and instructions for contributing to this project.

## Development Setup

Please refer to the [README.md](README.md) file for detailed instructions on setting up the development environment.

## Coding Standards

### General

- Use clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single task
- Use async/await for asynchronous operations

### Frontend

- Follow React best practices and hooks usage
- Group related components in folders
- Maintain responsive design principles
- Follow the existing component structure for consistency
- Use Tailwind CSS for styling

### Backend

- Follow RESTful API design principles
- Validate all incoming data
- Handle errors gracefully with appropriate status codes
- Use middleware for cross-cutting concerns
- Document all API endpoints

## Git Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them with descriptive commit messages
4. Push to your fork: `git push origin feature/your-feature-name`
5. Create a pull request to the main repository

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if necessary
3. Add tests for new features
4. Ensure all tests pass
5. Request review from maintainers

## Testing

- Write unit tests for utility functions and hooks
- Write integration tests for components and pages
- Test API endpoints with appropriate test cases
- Ensure all tests pass before submitting a pull request

## Project Structure

### Frontend Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable UI components
│   ├── contexts/    # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── utils/       # Utility functions
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
```

### Backend Structure

```
backend/
├── src/
│   ├── controllers/ # Request handlers
│   ├── middleware/  # Express middleware
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── utils/       # Utility functions
│   ├── app.js       # Express app setup
│   └── server.js    # Server entry point
```

## Feature Development

When developing new features:

1. Start by creating an issue describing the feature
2. Discuss the implementation approach with maintainers
3. Develop the feature according to the agreed approach
4. Add appropriate tests
5. Update documentation
6. Submit a pull request

## Bug Fixes

When fixing bugs:

1. Clearly describe the bug in an issue
2. Identify the root cause
3. Fix the issue with minimal changes
4. Add tests to prevent regression
5. Submit a pull request with reference to the issue

## Code of Conduct

- Be respectful and inclusive
- Constructive criticism is welcome
- Help others learn and grow
- Focus on what is best for the community

## Questions

If you have any questions about contributing, please open an issue or contact the maintainers directly.

Thank you for contributing to TimeMaster! 