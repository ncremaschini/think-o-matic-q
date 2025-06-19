# Integrations Guide 🔗

This guide explains how to set up API credentials for Miro, Trello, and AWS Bedrock integrations.

## AWS Bedrock Setup

### 1. AWS Account Setup

1. **Create AWS Account** (if you don't have one)
2. **Enable Bedrock Access:**
   - Go to AWS Console → Bedrock
   - Request access to foundation models
   - Wait for approval (usually instant for Nova Lite)

### 2. Create IAM User

1. **Go to IAM Console**
2. **Create User:**
   - User name: `think-o-matic-user`
   - Access type: Programmatic access
3. **Attach Policies:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:ListFoundationModels"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
4. **Save Credentials:**
   - Access Key ID
   - Secret Access Key

### 3. Configure AWS CLI

```bash
aws configure --profile think-o-matic
# Enter your Access Key ID and Secret Access Key
# Region: us-east-1 (or your preferred region)
# Output: json
```

Update `.env`:
```env
AWS_PROFILE_NAME=think-o-matic
```

## Miro API Setup

### 1. Create Miro App

1. **Go to Miro Developer Console:**
   - Visit: https://developers.miro.com/
   - Sign in with your Miro account

2. **Create New App:**
   - Click "Create new app"
   - App name: "Think-o-matic"
   - Description: "Workshop management tool"

3. **Configure App Settings:**
   - **Redirect URI:** `http://localhost:3000/auth/miro/callback`
   - **Scopes:** Select:
     - `boards:read`
     - `boards:write`
     - `team:read`

4. **Get App Credentials:**
   - Copy **Client ID**
   - Copy **Client Secret**

### 2. Get Access Token

#### Option A: Using OAuth Flow (Recommended)

1. **Authorization URL:**
   ```
   https://miro.com/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/auth/miro/callback&scope=boards:read,boards:write,team:read
   ```

2. **Replace YOUR_CLIENT_ID** with your actual Client ID
3. **Visit the URL** in your browser
4. **Authorize the app** - you'll be redirected with a code
5. **Exchange code for tokens:**

   ```bash
   curl -X POST https://api.miro.com/v1/oauth/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=YOUR_CODE&redirect_uri=http://localhost:3000/auth/miro/callback"
   ```

#### Option B: Using Personal Access Token (Quick Setup)

1. **Go to Miro Profile Settings:**
   - https://miro.com/app/settings/
   - Click "Your apps"
   - Find your app and click "Configure"

2. **Generate Personal Access Token:**
   - Click "Install app and get OAuth token"
   - Copy the generated token

### 3. Get Workspace ID

```bash
curl -X GET https://api.miro.com/v2/teams \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Copy the `id` of your desired team/workspace.

### 4. Update Environment Variables

```env
MIRO_CLIENT_ID=your_client_id_here
MIRO_CLIENT_SECRET=your_client_secret_here
MIRO_ACCESS_TOKEN=your_access_token_here
MIRO_REFRESH_TOKEN=your_refresh_token_here
MIRO_DEFAULT_WORKSPACE_ID=your_workspace_id_here
```

## Trello API Setup

### 1. Get API Key

1. **Go to Trello Developer Portal:**
   - Visit: https://trello.com/app-key
   - Sign in with your Trello account

2. **Copy Your API Key**

### 2. Get API Token

1. **Generate Token:**
   - On the same page, click "Token" link
   - Or visit: `https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Think-o-matic&key=YOUR_API_KEY`

2. **Replace YOUR_API_KEY** with your actual API key
3. **Authorize the application**
4. **Copy the generated token**

### 3. Get Board and List IDs

#### Find Board ID:

```bash
curl -X GET "https://api.trello.com/1/members/me/boards?key=YOUR_API_KEY&token=YOUR_TOKEN"
```

Look for your board and copy its `id`.

#### Find List ID:

```bash
curl -X GET "https://api.trello.com/1/boards/YOUR_BOARD_ID/lists?key=YOUR_API_KEY&token=YOUR_TOKEN"
```

Copy the `id` of the list where you want tasks to be created.

### 4. Update Environment Variables

```env
TRELLO_API_KEY=your_api_key_here
TRELLO_API_SECRET=your_api_token_here
TRELLO_DEFAULT_BOARD_ID=your_board_id_here
TRELLO_DEFAULT_LIST_ID=your_list_id_here
```

## Testing Your Setup

### Test AWS Bedrock

```bash
cd test
node test-bedrock.js
```

### Test Miro Integration

```bash
cd test
node test-miro.js
```

### Test Trello Integration

```bash
cd test
node test-trello.js
```

## Environment Variables Reference

Complete `.env` file example:

```env
# AWS Configuration
AWS_PROFILE_NAME=think-o-matic

# Miro Integration
MIRO_CLIENT_ID=3458764627547574495
MIRO_CLIENT_SECRET=your_client_secret
MIRO_ACCESS_TOKEN=your_access_token
MIRO_REFRESH_TOKEN=your_refresh_token
MIRO_DEFAULT_WORKSPACE_ID=3458764627547574495

# Trello Integration
TRELLO_API_KEY=your_api_key
TRELLO_API_SECRET=your_api_token
TRELLO_DEFAULT_BOARD_ID=your_board_id
TRELLO_DEFAULT_LIST_ID=your_list_id

# React App Environment Variables (for frontend)
REACT_APP_MIRO_DEFAULT_WORKSPACE_ID=3458764627547574495
REACT_APP_TRELLO_DEFAULT_BOARD_ID=your_board_id
REACT_APP_TRELLO_DEFAULT_LIST_ID=your_list_id

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Security Notes

- **Never commit `.env` files** to version control
- **Use environment-specific credentials** for different environments
- **Regularly rotate API tokens** for security
- **Limit API scopes** to minimum required permissions

## Troubleshooting

### Miro Issues
- **Invalid token:** Regenerate access token
- **Scope errors:** Check app permissions in Miro Developer Console
- **Workspace not found:** Verify workspace ID

### Trello Issues
- **Unauthorized:** Check API key and token
- **Board not found:** Verify board ID and permissions
- **List not found:** Ensure list belongs to the specified board

### AWS Issues
- **Access denied:** Check IAM permissions
- **Region errors:** Ensure Bedrock is available in your region
- **Model not found:** Verify model access in Bedrock console

Need more help? Check the [Troubleshooting Guide](TROUBLESHOOTING.md).
