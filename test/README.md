# Test Scripts

This directory contains various test scripts for debugging and validating integrations.

## Miro Integration Tests

- **`debug-miro.js`** - Direct Miro API testing (board creation)
- **`test-miro.js`** - Miro API connection testing  
- **`test-server-miro.js`** - Server endpoint testing for Miro integration
- **`test-simple.js`** - Simple server endpoint test

## Other Tests

- **`test-bedrock.js`** - AWS Bedrock API testing

## Usage

Make sure you have the required dependencies installed in the root directory:

```bash
# From project root
npm install axios dotenv

# Run any test
node test/debug-miro.js
node test/test-server-miro.js
```

## Notes

- All tests use the same `.env` file from the project root
- Miro tests require valid `MIRO_ACCESS_TOKEN` in `.env`
- Server tests require the development server to be running (`npm run dev`)
