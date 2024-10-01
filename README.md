# Todo Application

## Overview
This Todo Application is a feature-rich task management tool built with React. It provides users with the ability to create, manage, and track their tasks with an intuitive user interface and built-in timer functionality. The app is designed to enhance productivity by helping users stay organized and focused on their tasks.

## Key Features
- **Task Management**: Add, delete, and mark tasks as completed.
- **Timer Functionality**: Start, pause, and reset timers for each task to track time spent.
- **User Authentication**: Secure login and logout functionality using cookies.
- **Completed Tasks Overview**: View detailed information about completed tasks, including start time, total time spent, and end time.
- **Responsive Design**: The application is mobile-friendly and adjusts seamlessly across different screen sizes.

## Technologies Used
- **Frontend**:
  - React: JavaScript library for building user interfaces.
  - React Router: For navigating between different components.
  - CSS: For styling the application.
  - React Icons: For using icons throughout the application.

- **Backend**:
  - Node.js: JavaScript runtime for building the server.
  - Express: Web framework for handling API requests.
  - RESTful API: For handling requests and managing tasks.

- **Database**:
  - MongoDB: NoSQL database for storing tasks and user data.

## Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v14 or later)
- npm (Node package manager)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/todo-app.git
   cd todo-app

## API Endpoints

### User Authentication
- **POST `/register`**: Register a new user.
- **POST `/login`**: Log in an existing user and receive a JWT token.

### Todo Management
- **POST `/`**: Get all todos for the authenticated user.
- **POST `/add-todo`**: Add a new todo.
- **PUT `/change-status`**: Update the status of a todo.
- **DELETE `/delete-todo`**: Delete a todo.



## Deployed link: https://todo-apk-mk.netlify.app/
