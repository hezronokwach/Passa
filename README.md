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
- **Generative AI**: Firebase Genkit (for features like title translation)
- **Blockchain**: (Handled externally)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Set up your environment**:
    - Copy the `.env.example` file to `.env`.
    - Add your PostgreSQL database connection string to the `DATABASE_URL` variable.
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
3.  **Sync the database schema**:
    ```bash
    npx prisma db push
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:9002`.
