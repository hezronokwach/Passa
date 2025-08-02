# User Signin

## Overview
The user signin feature allows existing users to authenticate and access protected areas of the application. It involves submitting credentials from the frontend, verifying them in the backend, and returning an authentication token.

## Backend

### Route
`POST /auth/signin`

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Process
- Validates required fields.
- Finds the user by email in the PostgreSQL database using Knex.
- Verifies the password hash.
- Generates a JWT token valid for 1 hour.
- Returns user info and token in JSON response.

### Response
- Success (200 OK):
```json
{
  "message": "Signin successful",
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

- Error (400 Bad Request): Missing fields.
- Error (401 Unauthorized): Invalid credentials.
- Error (500 Internal Server Error): Server errors.

## Frontend

### Page
`SignInPage.tsx`

### Process
- Collects user input via form.
- Sends POST request to `/auth/signin`.
- On success, stores JWT token in `localStorage`.
- Redirects user to `/dashboard`.
