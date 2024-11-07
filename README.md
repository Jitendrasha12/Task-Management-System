# Project Name Task Management System

## Overview
This is a task management service built with Node.js and MongoDB, implementing user authentication, role management, and task CRUD operations.

## Setup Instructions

### 1. Install Dependencies
Run the following command to install all required dependencies:
```bash
npm install

Configure Environment Variables
Create a .env file in the root directory and add the following variables:
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

Start the Server

npm run dev


Assumptions and Design Decisions
Database: MongoDB is used for data storage.
Authentication: JWT (JSON Web Token) is used for securing API endpoints.
Error Handling: Basic error handling is in place for invalid inputs and unauthorized access.
Role Management: Basic roles (e.g., user, admin, manager) are implemented for access control.
Pagination: Pagination is applied to list endpoints with default settings (10 items per page).

Contributing
Feel free to fork the repository, make changes, and submit a pull request for contributions.