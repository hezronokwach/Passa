# GitHub Issues Creation Scripts

This directory contains scripts to automatically create GitHub issues for Passa development phases.

## 📋 What Gets Created

### Phase 1 Issues (8 issues)
**Focus: Database & Core Backend Logic**
- Database Schema Design & Migration Setup
- User Model Implementation  
- UserProfile Model Implementation
- Event Model Implementation
- Authentication Controller Implementation
- User Controller Implementation
- Event Controller Implementation
- API Documentation Setup

### Phase 2 Issues (8 issues)
**Focus: File Upload & Advanced Features**
- AWS S3 Integration for File Upload
- Profile Image Upload System
- Event Media Upload System
- Email Service Implementation
- User Dashboard Data Aggregation
- Advanced Search & Discovery System
- Notification System Backend
- Frontend Dashboard Integration

## 🚀 How to Use

### Prerequisites
1. **Node.js** installed on your system
2. **GitHub Personal Access Token** with `repo` permissions
3. **Repository access** to create issues

### Method 1: Using the Bash Script (Recommended)

```bash
# Run the interactive script
./scripts/create-issues.sh
```

The script will:
1. Check for Node.js installation
2. Prompt for your GitHub token (or use `GITHUB_TOKEN` env var)
3. Confirm repository details
4. Create all issues with proper labels

### Method 2: Using Node.js Script Directly

```bash
# Create issues directly
node scripts/create-github-issues.js <github-token> <repo-owner> <repo-name>

# Example
node scripts/create-github-issues.js ghp_xxxxxxxxxxxx hezronokwach Passa
```

### Method 3: Using Environment Variables

```bash
# Set environment variables
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
export REPO_OWNER="hezronokwach"
export REPO_NAME="Passa"

# Run the script
./scripts/create-issues.sh
```

## 🔑 GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (Full control of private repositories)
4. Copy the generated token
5. Use it with the script

## 🏷️ Issue Labels

The script creates issues with the following labels:

### Priority Labels
- `critical` - Must be completed immediately
- `high-priority` - Important for phase completion
- `medium-priority` - Standard priority items

### Component Labels
- `backend` - Backend/API development
- `frontend` - Frontend/UI development
- `database` - Database-related work
- `authentication` - Auth and security
- `events` - Event management features
- `user-management` - User-related features
- `file-upload` - File handling systems
- `email` - Email service integration
- `notifications` - Notification systems
- `search` - Search and discovery
- `analytics` - Analytics and reporting
- `dashboard` - Dashboard features
- `documentation` - Documentation work

### Phase Labels
- `phase-1` - Phase 1 issues
- `phase-2` - Phase 2 issues

## 📊 Issue Structure

Each issue includes:
- **Clear title** describing the feature/task
- **Detailed description** with context
- **Acceptance criteria** with checkboxes
- **Technical requirements** and constraints
- **Definition of done** for completion criteria
- **Appropriate labels** for organization

## 🔧 Troubleshooting

### Common Issues

**"Node.js not found"**
```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**"Authentication failed"**
- Check your GitHub token has `repo` permissions
- Ensure token is not expired
- Verify repository name and owner are correct

**"Rate limit exceeded"**
- The script includes 1-second delays between requests
- If you hit rate limits, wait and try again
- GitHub allows 5000 requests per hour for authenticated users

**"Permission denied"**
```bash
# Make script executable
chmod +x scripts/create-issues.sh
```

## 📝 Customization

To modify the issues:

1. Edit `scripts/create-github-issues.js`
2. Modify the `phase1Issues` or `phase2Issues` arrays
3. Update issue titles, descriptions, or labels as needed
4. Run the script to create updated issues

## 🎯 Next Steps

After creating the issues:

1. **Assign team members** to specific issues
2. **Set milestones** for each phase
3. **Create project boards** to track progress
4. **Link related issues** and dependencies
5. **Start development** following the roadmap

## 📞 Support

If you encounter issues with the scripts:
1. Check the troubleshooting section above
2. Verify your GitHub token and permissions
3. Ensure repository details are correct
4. Check Node.js installation and version

---

**Happy coding! 🚀**
