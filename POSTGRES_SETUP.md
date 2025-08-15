# PostgreSQL Setup Guide for Passa Application

This guide will help you set up PostgreSQL for the Passa application and configure VS Code Database Client extension for database management.

## Prerequisites

- PostgreSQL installed on your system
- Node.js and npm installed
- VS Code with Database Client extension installed

## 1. PostgreSQL Database Setup

### Step 1: Create Database User and Database

Open your terminal and run the following commands:

```bash
# Switch to postgres user and create the database role
sudo -u postgres psql -c "CREATE ROLE passa WITH LOGIN PASSWORD 'passa123' CREATEDB;"

# Create the database
sudo -u postgres psql -c "CREATE DATABASE passa_db OWNER passa;"
```

**Note:** If the role already exists, you can update it:
```bash
sudo -u postgres psql -c "ALTER ROLE passa WITH PASSWORD 'passa123' CREATEDB;"
```

### Step 2: Test Database Connection

Verify the connection works:
```bash
PGPASSWORD=passa123 psql -h localhost -U passa -d passa_db -c "SELECT version();"
```

You should see PostgreSQL version information if the connection is successful.

## 2. Environment Configuration

### Step 3: Update .env File

Make sure your `.env` file contains the correct database URL:

```env
# Database URL for Prisma
DATABASE_URL="postgresql://passa:passa123@localhost:5432/passa_db?schema=public"

# Session secret for JWT encryption
SESSION_SECRET="your-super-secret-session-key"

# Google Gemini API Key for AI features
GEMINI_API_KEY="your-gemini-api-key"

# Node environment
NODE_ENV="development"
```

## 3. Prisma Setup

### Step 4: Run Database Migrations

Initialize the database schema:

```bash
# Run Prisma migrations to create tables
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### Step 5: Verify Setup

Test that the application starts correctly:
```bash
npm run dev
```

The application should start on `http://localhost:9002` without database connection errors.

## 4. VS Code Database Client Extension Setup

### Step 6: Install Database Client Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Database Client" by Weijan Chen
4. Install the extension

### Step 7: Configure Database Connection

1. **Open Database Client Panel:**
   - Click on the Database Client icon in the sidebar (looks like a database symbol)
   - Or use Command Palette (Ctrl+Shift+P) and search "Database Client: Focus"

2. **Add New Connection:**
   - Click the "+" button to add a new connection
   - Select "PostgreSQL"

3. **Enter Connection Details:**
   ```
   Host: localhost
   Port: 5432
   Username: passa
   Password: passa123
   Database: passa_db
   ```

4. **Connection Settings:**
   - **Connection Name:** `Passa Local DB` (or any name you prefer)
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Username:** `passa`
   - **Password:** `passa123`
   - **Database:** `passa_db`
   - **SSL:** Disable (for local development)

5. **Test and Save:**
   - Click "Test" to verify the connection
   - Click "Connect" to save and establish the connection

### Step 8: Using Database Client

Once connected, you can:

- **Browse Tables:** Expand the connection to see all tables created by Prisma
- **Run Queries:** Right-click on the connection and select "New Query"
- **View Data:** Click on any table to view its contents
- **Execute SQL:** Write and execute custom SQL queries

### Common Database Client Features:

- **View Table Structure:** Right-click table → "Show Table Info"
- **Export Data:** Right-click table → "Export Data"
- **Import Data:** Right-click database → "Import Data"
- **Generate SQL:** Right-click table → "Generate SQL"

## 5. Database Schema Overview

The Passa database includes these main tables:

- **User** - User accounts and profiles
- **CreatorProfile** - Creator-specific information
- **OrganizerProfile** - Organizer-specific information
- **Event** - Events created by organizers
- **Ticket** - Ticket types for events
- **PurchasedTicket** - Individual tickets purchased by users
- **CreativeBrief** - Work opportunities posted by organizers
- **Submission** - Content submitted by creators
- **Attribution** - Revenue attribution tracking
- **Transaction** - Payment transaction records
- **NewsletterSubscription** - Newsletter subscribers

## 6. Troubleshooting

### Common Issues:

**1. "Peer authentication failed"**
- Make sure you're using `-h localhost` when connecting via psql
- Use TCP connection instead of local socket

**2. "Permission denied to create database"**
- Ensure the user has CREATEDB permission:
  ```bash
  sudo -u postgres psql -c "ALTER ROLE passa CREATEDB;"
  ```

**3. "Database does not exist"**
- Create the database:
  ```bash
  sudo -u postgres psql -c "CREATE DATABASE passa_db OWNER passa;"
  ```

**4. VS Code Database Client won't connect**
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check if the port 5432 is open: `sudo netstat -tlnp | grep 5432`
- Ensure password is correct in both .env and VS Code settings

### Useful Commands:

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Connect to database directly
psql -h localhost -U passa -d passa_db

# View all databases
sudo -u postgres psql -c "\l"

# View all users/roles
sudo -u postgres psql -c "\du"
```

## 7. Security Notes

**For Production:**
- Change the default password `passa123` to a strong, unique password
- Use environment variables for sensitive data
- Configure proper SSL certificates
- Restrict database access to specific IP addresses
- Regular database backups

**For Development:**
- The current setup is suitable for local development
- Keep the .env file in .gitignore to avoid committing credentials
- Consider using different databases for different environments (dev, staging, prod)

## 8. Team Collaboration

**Sharing Database Changes:**
- Always use Prisma migrations for schema changes
- Commit migration files to version control
- Team members should run `npx prisma migrate dev` after pulling changes
- Use `npx prisma db push` only for prototyping

**Database Client Settings Sync:**
- Each team member needs to configure their own Database Client connection
- Consider creating a shared connection template or documentation
- Use consistent naming conventions for connections

---

## Quick Setup Checklist

- [ ] PostgreSQL installed and running
- [ ] Database user `passa` created with password `passa123`
- [ ] Database `passa_db` created and owned by `passa`
- [ ] `.env` file updated with correct DATABASE_URL
- [ ] Prisma migrations run successfully
- [ ] Application starts without database errors
- [ ] VS Code Database Client extension installed
- [ ] Database connection configured in VS Code
- [ ] Can browse tables and run queries in VS Code

---

**Need Help?** If you encounter any issues during setup, check the troubleshooting section or reach out to the team for assistance.