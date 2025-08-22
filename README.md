# Passa: Secure African Events

Passa is a cutting-edge event ticketing platform built for the African continent, leveraging blockchain technology to bring transparency, security, and fairness to fans, artists, and event organizers.

## Core Problems Passa Solves

- **Ticket Fraud**: Eliminates fake tickets and scalping through on-chain verification.
- **Delayed Artist Payments**: Ensures artists and creators are paid instantly through automated revenue splits.
- **Lack of Transparency**: Provides clear, verifiable attribution for creators and sponsors, proving their impact.

## Key Features

- **Live Event Grid**: A curated marketplace of upcoming events.
- **Secure Ticket Purchasing**: Fans can buy authentic tickets with confidence.
- **Instant Revenue Splits**: Artists and contributors receive their share of ticket sales in real-time.
- **Creator Economy Hub**: A marketplace for event organizers to hire creative talent (videographers, designers, etc.) to promote their events.
- **Transparent Attribution**: On-chain data provides undeniable proof of creative contributions and their impact.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js Server Actions, Prisma
- **Database**: PostgreSQL

- **Blockchain**: (Handled externally)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Set up your environment**:
    - Copy the `.env.example` file to `.env`.
    - Update the `DATABASE_URL` variable with your PostgreSQL database connection string.
    - Set the `SESSION_SECRET` to a secure random string.
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    SESSION_SECRET="your-super-secret-session-key"
    ```
3.  **Set up the database**:
    You can either run our setup script:
    ```bash
    ./simple-setup.sh
    ```
    Or manually run Prisma migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:9002`.

## Authentication System

Passa implements a role-based authentication system with the following features:

- **Secure Password Storage**: Passwords are hashed using bcrypt with 10 salt rounds
- **Session Management**: JWT-based sessions with proper encryption
- **Role-Based Access Control**: Users can be Fans, Creators, Organizers, or Admins
- **Protected Routes**: Middleware ensures only authenticated users can access dashboard pages
- **Automatic Redirection**: Users are redirected to their appropriate dashboard after login/signup

### Roles

- **Fan**: Can browse events and purchase tickets
- **Creator**: Can apply for creative opportunities and manage their portfolio
- **Organizer**: Can create events and manage submissions
- **Admin**: Can access administrative features (not fully implemented yet)

## Database Setup

If you're using a local PostgreSQL instance, make sure it's running and you have a database created. The `simple-setup.sh` script will attempt to create the database automatically using Prisma.

For production deployments, update the `DATABASE_URL` in your environment variables to point to your production database.
