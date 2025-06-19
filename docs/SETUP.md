# Setup Guide 📋

This guide will help you set up Think-o-matic on your local machine.

## Prerequisites

### Required Software
- Node.js 18 or higher
- npm (comes with Node.js)
- Git
- AWS CLI v2

### Required Accounts
- AWS Account with Bedrock access
- Miro Account (free tier works)
- Trello Account (free tier works)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd think-o-matic-q

# Install dependencies for both frontend and backend
npm run install:all
```

### 2. AWS Configuration

1. **Install AWS CLI** if you haven't already:
   - [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

2. **Configure AWS CLI:**
   ```bash
   aws configure
   ```
   Enter your:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., us-east-1)
   - Default output format (json)

3. **Verify Bedrock Access:**
   ```bash
   aws bedrock list-foundation-models
   ```
   You should see a list of available models including Claude/Nova Lite.

### 3. Environment Setup

1. **Create Environment File:**
   ```bash
   cp .env.example .env
   ```

2. **Edit Environment Variables:**
   ```env
   # AWS Configuration
   AWS_PROFILE_NAME=your_aws_profile

   # Miro Integration
   MIRO_CLIENT_ID=your_miro_client_id
   MIRO_CLIENT_SECRET=your_miro_client_secret
   MIRO_ACCESS_TOKEN=your_access_token
   MIRO_REFRESH_TOKEN=your_refresh_token
   MIRO_DEFAULT_WORKSPACE_ID=your_workspace_id

   # Trello Integration
   TRELLO_API_KEY=your_trello_api_key
   TRELLO_API_SECRET=your_trello_api_secret
   TRELLO_DEFAULT_BOARD_ID=your_default_board_id
   TRELLO_DEFAULT_LIST_ID=your_default_list_id
   ```

   > 📝 See the [Integrations Guide](INTEGRATIONS.md) for detailed instructions on obtaining these credentials.

### 4. Start the Application

1. **Development Mode:**
   ```bash
   npm run dev
   ```
   This starts both frontend and backend:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

2. **Verify Installation:**
   - Open http://localhost:3000 in your browser
   - You should see the Think-o-matic dashboard
   - Create a test workshop to verify functionality

## Configuration Options

### Custom Port Numbers

Edit in `server/src/index.ts`:
```typescript
const PORT = process.env.PORT || 3001;
```

### Storage Location

Workshop data is stored in JSON files at:
```
server/src/data/workshops.json
```

## Common Setup Issues

### Port Already in Use
```bash
# Kill process using port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process using port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```

### Node Version Mismatch
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or update Node.js manually
```

### AWS Credentials Not Found
```bash
# Verify AWS credentials
aws configure list
```

## Next Steps

- Review the [Integrations Guide](INTEGRATIONS.md) to set up Miro and Trello
- Check the [API Documentation](API.md) to understand available endpoints
- See [Troubleshooting](TROUBLESHOOTING.md) for common issues

## Need Help?

If you encounter any issues:
1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review error messages in the console
3. Verify all environment variables are set correctly
