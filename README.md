# Think-o-matic 🧠⚡
AI-powered workshop preparation and follow-up tool that integrates with Miro and Trello.

> **⚡ Generated with AI**: This entire repository was created through a vibe-coding session with Amazon Q Developer and for educational purposes. Read about the experience in my blog post: [Building Think-o-matic: A Vibe-Coding Journey with Amazon Q](<your-blog-post-url>)

## 🎯 What it does

Think-o-matic streamlines your entire workshop lifecycle:

1. **📝 Create workshops** with structured planning and participant details
2. **🤖 Generate AI-powered agendas** using Amazon Bedrock (Nova Lite)
3. **🎨 Create Miro boards** automatically from workshop templates
4. **📊 Analyze workshop outcomes** with AI-powered sentiment analysis
5. **✅ Generate Trello tasks** automatically from workshop action items

## ✨ Key Features

- **Complete Workshop Lifecycle Management** - From planning to follow-up
- **AI-Powered Content Generation** - Smart agenda creation and analysis
- **Seamless Integrations** - Miro for collaboration, Trello for task management
- **Real-time Status Tracking** - Visual workflow with clear next steps
- **Flexible Configuration** - Customizable board and list assignments per workshop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured with Bedrock access
- AWS profile (default or custom)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd think-o-matic-q
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (see Setup Guide)
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

   This starts:
   - 🖥️ Backend server on http://localhost:3001
   - 🌐 Frontend React app on http://localhost:3000

## 📖 Documentation

- **[📋 Setup Guide](docs/SETUP.md)** - Detailed installation and configuration
- **[🔗 Integrations Guide](docs/INTEGRATIONS.md)** - Miro, Trello, and AWS setup
- **[🛠️ API Documentation](docs/API.md)** - Complete endpoint reference
- **[🔧 Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🏗️ Architecture

```
think-o-matic/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API clients
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Helper functions
├── server/                 # Express TypeScript backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript definitions
│   │   └── data/           # JSON storage
├── docs/                   # Documentation
└── test/                   # Test scripts
```

## 🔄 Workshop Workflow

1. **Create** → Fill in workshop details and integration settings
2. **Generate Agenda** → AI creates structured agenda based on workshop type
3. **Create Board** → Miro board generated from template
4. **Conduct Workshop** → Mark as conducted when complete
5. **Analyze** → AI analyzes Miro board content for insights
6. **Create Tasks** → Trello cards generated from action items

## 🎮 Usage Examples

### Creating a Brainstorming Workshop
```
Title: "Product Roadmap Planning"
Type: Brainstorming
Duration: 90 minutes
Participants: 8 (Product team)
Goal: "Define Q2 product priorities"
```

### Generated Output
- ✅ Structured 90-minute agenda with activities
- ✅ Miro board with brainstorming template
- ✅ Post-workshop analysis with sentiment and themes
- ✅ Trello tasks for follow-up actions

## 🔐 Environment Variables

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

> 📚 **Need help getting these credentials?** Check the [Integrations Guide](docs/INTEGRATIONS.md)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run server:dev       # Backend only
npm run client:dev       # Frontend only

# Building
npm run build           # Build frontend for production
npm run server:build    # Build backend

# Testing
npm run test:miro       # Test Miro integration
npm run test:trello     # Test Trello integration
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **Backend**: Node.js, Express, TypeScript
- **AI**: Amazon Bedrock (Nova Lite)
- **Integrations**: Miro API, Trello API
- **Storage**: JSON files (for prototyping)

## 🤝 Contributing

This is a prototype project. Feel free to:
- Report issues
- Suggest improvements
- Fork and experiment
- Add new workshop types or integrations

## 📝 License

MIT License - Use this for your own workshop management needs!

---

**Need help?** Check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md) or review the detailed [Setup Instructions](docs/SETUP.md).
