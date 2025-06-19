# Troubleshooting Guide 🔧

Common issues and solutions for Think-o-matic.

## Installation Issues

### Node.js Version Problems

**Problem:** `Error: Unsupported Node.js version`

**Solution:**
```bash
# Check your Node.js version
node --version

# Install Node.js 18+ using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Dependency Installation Fails

**Problem:** `npm install` fails with permission errors

**Solution:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Or use yarn instead
npm install -g yarn
yarn install
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run server:dev
```

## Environment Configuration

### AWS Credentials Not Found

**Problem:** `Unable to locate credentials`

**Solution:**
```bash
# Check AWS configuration
aws configure list

# Reconfigure if needed
aws configure --profile your-profile-name

# Verify credentials work
aws sts get-caller-identity
```

### Environment Variables Not Loading

**Problem:** API calls fail with "undefined" values

**Solution:**
1. **Check .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Verify .env format:**
   ```env
   # No spaces around = sign
   AWS_PROFILE_NAME=your-profile
   
   # Not this:
   AWS_PROFILE_NAME = your-profile
   ```

3. **Restart the server** after changing .env

## API Integration Issues

### Miro API Problems

#### Invalid Access Token

**Problem:** `401 Unauthorized` from Miro API

**Solutions:**
1. **Regenerate access token:**
   - Go to Miro Developer Console
   - Regenerate token for your app

2. **Check token expiration:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.miro.com/v2/teams
   ```

3. **Verify scopes:**
   - Ensure your app has `boards:read` and `boards:write` permissions

#### Board Creation Fails

**Problem:** `403 Forbidden` when creating boards

**Solutions:**
1. **Check workspace permissions:**
   - Verify you're a member of the workspace
   - Ensure workspace allows app installations

2. **Verify workspace ID:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.miro.com/v2/teams
   ```

### Trello API Problems

#### Invalid API Key/Token

**Problem:** `401 Unauthorized` from Trello API

**Solutions:**
1. **Regenerate API token:**
   - Visit: https://trello.com/app-key
   - Generate new token

2. **Check token permissions:**
   - Ensure token has `read` and `write` scope

#### Board/List Not Found

**Problem:** `404 Not Found` when creating cards

**Solutions:**
1. **Verify board ID:**
   ```bash
   curl "https://api.trello.com/1/members/me/boards?key=YOUR_KEY&token=YOUR_TOKEN"
   ```

2. **Check list belongs to board:**
   ```bash
   curl "https://api.trello.com/1/boards/YOUR_BOARD_ID/lists?key=YOUR_KEY&token=YOUR_TOKEN"
   ```

3. **Update environment variables:**
   ```env
   TRELLO_DEFAULT_BOARD_ID=correct_board_id
   TRELLO_DEFAULT_LIST_ID=correct_list_id
   ```

### AWS Bedrock Issues

#### Access Denied

**Problem:** `AccessDeniedException` when generating agendas

**Solutions:**
1. **Check IAM permissions:**
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

2. **Verify region:**
   - Bedrock is not available in all regions
   - Try `us-east-1` or `us-west-2`

#### Model Not Found

**Problem:** `ValidationException: The model ID is invalid`

**Solutions:**
1. **Check available models:**
   ```bash
   aws bedrock list-foundation-models
   ```

2. **Update model ID in code:**
   ```typescript
   // In server/src/services/bedrockService.ts
   const modelId = 'amazon.nova-lite-v1:0';
   ```

## Frontend Issues

### React App Won't Start

**Problem:** Frontend compilation errors

**Solutions:**
1. **Clear cache:**
   ```bash
   rm -rf client/node_modules
   rm client/package-lock.json
   cd client && npm install
   ```

2. **Check TypeScript errors:**
   ```bash
   cd client && npm run type-check
   ```

### API Calls Failing

**Problem:** `Network Error` or `CORS` issues

**Solutions:**
1. **Verify backend is running:**
   ```bash
   curl http://localhost:3001/api/workshops
   ```

2. **Check proxy configuration** in `client/package.json`:
   ```json
   {
     "proxy": "http://localhost:3001"
   }
   ```

## Data Issues

### Workshop Data Corrupted

**Problem:** App crashes when loading workshops

**Solutions:**
1. **Backup and reset data:**
   ```bash
   cp server/src/data/workshops.json server/src/data/workshops.backup.json
   echo "[]" > server/src/data/workshops.json
   ```

2. **Validate JSON format:**
   ```bash
   cat server/src/data/workshops.json | jq .
   ```

### Storage Permission Issues

**Problem:** `EACCES: permission denied` when saving workshops

**Solutions:**
```bash
# Fix file permissions
chmod 644 server/src/data/workshops.json
chmod 755 server/src/data/
```

## Performance Issues

### Slow API Responses

**Problem:** API calls take too long

**Solutions:**
1. **Check AWS region latency:**
   - Use a region closer to your location

2. **Monitor API rate limits:**
   - Miro: 100 requests per minute
   - Trello: 300 requests per 10 seconds

3. **Enable request caching** (for development):
   ```typescript
   // Add caching to frequently called endpoints
   ```

### Memory Issues

**Problem:** Node.js runs out of memory

**Solutions:**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server/src/index.js

# Or set in package.json
"scripts": {
  "server:dev": "node --max-old-space-size=4096 ..."
}
```

## Debugging Tips

### Enable Debug Logging

1. **Backend logging:**
   ```typescript
   // Add to server/src/index.ts
   console.log('Environment variables:', {
     AWS_PROFILE_NAME: process.env.AWS_PROFILE_NAME,
     MIRO_CLIENT_ID: process.env.MIRO_CLIENT_ID ? 'SET' : 'NOT SET',
     TRELLO_API_KEY: process.env.TRELLO_API_KEY ? 'SET' : 'NOT SET'
   });
   ```

2. **Frontend debugging:**
   ```javascript
   // Add to client/src/services/api.ts
   console.log('API call:', method, url, data);
   ```

### Test Individual Components

1. **Test AWS Bedrock:**
   ```bash
   cd test && node test-bedrock.js
   ```

2. **Test Miro API:**
   ```bash
   cd test && node test-miro.js
   ```

3. **Test Trello API:**
   ```bash
   cd test && node test-trello.js
   ```

### Browser Developer Tools

1. **Check Network tab** for failed API calls
2. **Check Console** for JavaScript errors
3. **Check Application tab** for localStorage issues

## Getting Help

### Log Files

Check these locations for error logs:
- **Backend:** Console output where you ran `npm run server:dev`
- **Frontend:** Browser developer console
- **System logs:** Check system logs for port conflicts

### Useful Commands

```bash
# Check all running Node processes
ps aux | grep node

# Check port usage
netstat -tulpn | grep :3001

# Test API endpoints
curl -v http://localhost:3001/api/workshops

# Check environment variables
printenv | grep -E "(AWS|MIRO|TRELLO)"
```

### Common Error Patterns

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| `ECONNREFUSED` | Backend not running | Start backend server |
| `401 Unauthorized` | Invalid API credentials | Check API keys/tokens |
| `404 Not Found` | Wrong endpoint URL | Check API documentation |
| `CORS error` | Frontend/backend mismatch | Check proxy configuration |
| `ValidationException` | Invalid request data | Check request format |

### Still Need Help?

1. **Check the logs** for specific error messages
2. **Test individual components** to isolate the issue
3. **Verify all environment variables** are set correctly
4. **Try the test scripts** to validate integrations
5. **Review the setup guides** for missed steps

Remember: Most issues are related to environment configuration or API credentials. Double-check your `.env` file first!
