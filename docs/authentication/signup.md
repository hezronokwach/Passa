# User Signup

## Overview
The user signup feature allows new users to register an account in the system. It involves submitting user details from the frontend, creating the user in the backend database, and returning an authentication token.

## Backend

### Route
`POST /auth/signup`

### Request Body
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string"
}
```

### Process
- Validates required fields.
- Checks for existing username and email.
- Hashes the password.
- Saves the user to the PostgreSQL database using Knex.
- Generates a JWT token valid for 1 hour.
- Returns user info and token in JSON response.

### Response
- Success (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "user_id": 1,
    "username": "exampleuser",
    "email": "user@example.com",
    "first_name": "First",
    "last_name": "Last"
  },
  "token": "jwt-token-string"
}
```

- Error (400 Bad Request): Validation errors.
- Error (500 Internal Server Error): Server errors.

## Frontend

### Page
`SignUpPage.tsx`

### Process
- Collects user input via form.
- Sends POST request to `/auth/signup`.
- On success, stores JWT token in `localStorage`.
- Redirects user to `/dashboard`.
