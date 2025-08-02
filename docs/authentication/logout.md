# User Logout

## Overview
The user logout feature allows authenticated users to end their session by clearing authentication tokens and redirecting to the signin page.

## Frontend

### Page
`LogoutPage.tsx`

### Process
- Clears the JWT token stored in `localStorage`.
- Redirects the user to the `/signin` page.

### Usage
- A logout button is provided in the `DashboardPage.tsx`.
- Clicking the logout button triggers the logout process by clearing the token and redirecting to the logout route.
- The `/logout` route renders the `LogoutPage` component which performs the token clearing and redirection.

## Route
- `/logout` (frontend route only, no backend interaction)

## Notes
- The backend does not currently maintain session state or token blacklisting.
- Authentication is managed via JWT tokens stored on the client.
- For enhanced security, backend token verification middleware will be implemented to protect API routes.
