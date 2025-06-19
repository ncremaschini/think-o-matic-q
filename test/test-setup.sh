#!/bin/bash

echo "🧠⚡ Think-o-matic Setup Test"
echo "================================"

# Test backend compilation
echo "Testing backend TypeScript compilation..."
cd server && npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ Backend TypeScript compilation successful"
else
    echo "❌ Backend TypeScript compilation failed"
    exit 1
fi

# Test frontend compilation
echo "Testing frontend TypeScript compilation..."
cd ../client && npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ Frontend TypeScript compilation successful"
else
    echo "❌ Frontend TypeScript compilation failed"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Ready to start development."
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "This will start:"
echo "  - Backend server on http://localhost:3001"
echo "  - Frontend React app on http://localhost:3000"
