# API Documentation

## Introduction

Welcome to the API documentation for the TodoList application. This API is designed to manage tasks, workspaces, and user authentication. Please follow the recommended order of usage for a seamless experience.

<details><summary>Read me</summary>

### Usage Order

1. **Create a User**

   - Endpoint: POST /users
   - Description: Create a new user account.

2. **Authentication**

   - Endpoint: POST /login
   - Description: Authenticate a user for accessing protected routes.

3. **Create a Workspace**

   - Endpoint: POST /workspaces
   - Description: Create a new workspace for task organization.

4. **Create Columns**

   - Endpoint: POST /columns
   - Description: Define columns within a workspace to categorize tasks.

5. **Create Tasks**
   - Endpoint: POST /tasks
   - Description: Add tasks to the workspace columns.

### Important Notes

- Many endpoints require authentication. Use the /login endpoint after creating a user to obtain the necessary credentials.
- Follow the specified order to ensure a smooth workflow.

## Additional Information

It has been decided that each parent entity stops at its first mention when requesting all details. Only elements specifically requested in detail provide a comprehensive approach to their composition.

## Authentication

The API uses a token-based authentication system. Obtain the authentication token by making a POST request to /login with valid user credentials.

## API Base URL

All API requests should be made to the following base URL: https://api.example.com/v1. Please replace example.com with the actual domain.

## Errors and Troubleshooting

For information on error handling, HTTP status codes, and common error responses, refer to the Error Handling section.

Feel free to explore the various endpoints and enhance your task management experience!

</details>
