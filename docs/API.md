# API Documentation 🛠️

Complete reference for Think-o-matic REST API endpoints.

## Base URL

```
http://localhost:3001/api
```

## Workshop Endpoints

### Get All Workshops

```http
GET /workshops
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Product Roadmap Planning",
    "goal": "Define Q2 product priorities",
    "type": "brainstorming",
    "expectedOutcomes": "Clear roadmap with priorities",
    "dateTime": "2025-06-11T14:00:00Z",
    "duration": 90,
    "participantCount": 8,
    "participantTypes": "Product team",
    "miroWorkspaceId": "3458764627547574495",
    "trelloBoardId": "KE5TzV2Y",
    "trelloListId": "681f6826a4dd59bb2c717861",
    "status": "created",
    "createdAt": "2025-06-10T10:00:00Z",
    "updatedAt": "2025-06-10T10:00:00Z"
  }
]
```

### Get Workshop by ID

```http
GET /workshops/:id
```

**Parameters:**
- `id` (string): Workshop UUID

**Response:**
```json
{
  "id": "uuid",
  "title": "Product Roadmap Planning",
  "goal": "Define Q2 product priorities",
  "type": "brainstorming",
  "expectedOutcomes": "Clear roadmap with priorities",
  "dateTime": "2025-06-11T14:00:00Z",
  "duration": 90,
  "participantCount": 8,
  "participantTypes": "Product team",
  "status": "agenda-generated",
  "agenda": "### Workshop Agenda...",
  "miroBoard": {
    "id": "uXjVIqR8SOE=",
    "url": "https://miro.com/app/board/uXjVIqR8SOE="
  },
  "analysis": {
    "summary": {
      "brief": "Workshop focused on...",
      "detailed": "Detailed analysis..."
    },
    "sentiment": {
      "overall": "POSITIVE",
      "score": 4,
      "explanation": "Constructive discussions..."
    },
    "actionItems": [
      {
        "task": "Review workshop outcomes",
        "priority": "HIGH",
        "category": "Process"
      }
    ]
  },
  "trelloTasks": {
    "cards": [
      {
        "id": "68481f47cd1f6552cf413483",
        "name": "[Workshop] Review outcomes",
        "url": "https://trello.com/c/JMmU7JSA"
      }
    ],
    "boardUrl": "https://trello.com/b/KE5TzV2Y"
  }
}
```

### Create Workshop

```http
POST /workshops
```

**Request Body:**
```json
{
  "title": "Product Roadmap Planning",
  "goal": "Define Q2 product priorities",
  "type": "brainstorming",
  "expectedOutcomes": "Clear roadmap with priorities",
  "dateTime": "2025-06-11T14:00:00Z",
  "duration": 90,
  "participantCount": 8,
  "participantTypes": "Product team",
  "miroWorkspaceId": "3458764627547574495",
  "trelloBoardId": "KE5TzV2Y",
  "trelloListId": "681f6826a4dd59bb2c717861"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Product Roadmap Planning",
  "status": "created",
  "createdAt": "2025-06-10T10:00:00Z",
  "updatedAt": "2025-06-10T10:00:00Z"
}
```

### Update Workshop

```http
PUT /workshops/:id
```

**Parameters:**
- `id` (string): Workshop UUID

**Request Body:** Same as Create Workshop

### Delete Workshop

```http
DELETE /workshops/:id
```

**Parameters:**
- `id` (string): Workshop UUID

**Response:**
```json
{
  "message": "Workshop deleted successfully"
}
```

## Workshop Actions

### Generate Agenda

```http
POST /workshops/:id/generate-agenda
```

**Parameters:**
- `id` (string): Workshop UUID

**Response:**
```json
{
  "id": "uuid",
  "status": "agenda-generated",
  "agenda": "### Workshop Agenda: Product Roadmap Planning\n\n**Date:** 2025-06-11...",
  "updatedAt": "2025-06-10T10:05:00Z"
}
```

### Create Miro Board

```http
POST /workshops/:id/create-miro-board
```

**Parameters:**
- `id` (string): Workshop UUID

**Response:**
```json
{
  "id": "uuid",
  "status": "miro-board-created",
  "miroBoard": {
    "id": "uXjVIqR8SOE=",
    "url": "https://miro.com/app/board/uXjVIqR8SOE="
  },
  "updatedAt": "2025-06-10T10:10:00Z"
}
```

### Update Workshop Status

```http
PATCH /workshops/:id/status
```

**Parameters:**
- `id` (string): Workshop UUID

**Request Body:**
```json
{
  "status": "workshop-conducted"
}
```

**Valid Status Values:**
- `created`
- `agenda-generated`
- `agenda-approved`
- `miro-board-created`
- `workshop-conducted`
- `analysis-completed`
- `tasks-created`

### Analyze Workshop

```http
POST /workshops/:id/analyze
```

**Parameters:**
- `id` (string): Workshop UUID

**Response:**
```json
{
  "id": "uuid",
  "status": "analysis-completed",
  "analysis": {
    "summary": {
      "brief": "Workshop focused on identifying problems and brainstorming solutions",
      "detailed": "The workshop content indicates a structured approach to problem-solving..."
    },
    "sentiment": {
      "overall": "POSITIVE",
      "score": 4,
      "explanation": "The workshop content is constructive and forward-looking"
    },
    "participation": {
      "level": "MEDIUM",
      "evidence": "Active participation with sticky notes and discussions"
    },
    "actionItems": [
      {
        "task": "Identify and document the specific problem to be solved",
        "priority": "HIGH",
        "category": "Process"
      },
      {
        "task": "Brainstorm and document additional solutions",
        "priority": "MEDIUM",
        "category": "Process"
      }
    ],
    "keyThemes": [
      {
        "theme": "Problem Identification and Solution Brainstorming",
        "frequency": 3,
        "context": "Strong focus on identifying problems and brainstorming solutions"
      }
    ],
    "recommendations": [
      "Ensure sticky notes are filled with specific content",
      "Consider adding more detailed discussions on solutions"
    ]
  }
}
```

### Create Trello Tasks

```http
POST /workshops/:id/create-tasks
```

**Parameters:**
- `id` (string): Workshop UUID

**Response:**
```json
{
  "success": true,
  "workshop": {
    "id": "uuid",
    "status": "tasks-created",
    "trelloTasks": {
      "cards": [
        {
          "id": "68481f47cd1f6552cf413483",
          "name": "[Product Roadmap Planning] Review workshop outcomes",
          "desc": "**Action Item from Workshop**\n\nReview workshop outcomes and key decisions",
          "url": "https://trello.com/c/JMmU7JSA",
          "dateCreated": "2025-06-10T12:04:23.179Z"
        }
      ],
      "boardUrl": "https://trello.com/b/KE5TzV2Y",
      "actionItems": [
        "Review workshop outcomes and key decisions",
        "Follow up on participant feedback"
      ]
    }
  },
  "tasksCreated": 2,
  "boardUrl": "https://trello.com/b/KE5TzV2Y",
  "message": "Successfully created 2 tasks in Trello"
}
```

### Update Agenda

```http
PATCH /workshops/:id/agenda
```

**Parameters:**
- `id` (string): Workshop UUID

**Request Body:**
```json
{
  "agenda": "### Updated Workshop Agenda\n\nNew content here..."
}
```

## Data Types

### Workshop Types

```typescript
type WorkshopType = 
  | 'brainstorming'
  | 'retrospective'
  | 'planning'
  | 'design-thinking'
  | 'problem-solving';
```

### Workshop Status

```typescript
type WorkshopStatus = 
  | 'created'
  | 'agenda-generated'
  | 'agenda-approved'
  | 'miro-board-created'
  | 'workshop-conducted'
  | 'analysis-completed'
  | 'tasks-created';
```

### Priority Levels

```typescript
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
```

### Sentiment Levels

```typescript
type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
```

### Participation Levels

```typescript
type ParticipationLevel = 'HIGH' | 'MEDIUM' | 'LOW';
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": "Title is required"
}
```

### 404 Not Found

```json
{
  "error": "Workshop not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to generate agenda",
  "details": "AWS Bedrock service unavailable"
}
```

## Rate Limits

- **General API calls:** 100 requests per minute
- **AI operations (agenda generation, analysis):** 10 requests per minute
- **External API calls (Miro, Trello):** Limited by respective service limits

## Authentication

Currently, the API does not require authentication as it's designed for local development. In a production environment, you would implement:

- API key authentication
- JWT tokens
- OAuth integration

## Testing the API

### Using curl

```bash
# Get all workshops
curl http://localhost:3001/api/workshops

# Create a workshop
curl -X POST http://localhost:3001/api/workshops \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Workshop",
    "goal": "Test the API",
    "type": "brainstorming",
    "expectedOutcomes": "Working API",
    "dateTime": "2025-06-11T14:00:00Z",
    "duration": 60,
    "participantCount": 5,
    "participantTypes": "Development team"
  }'
```

### Using the Test Scripts

```bash
cd test
node test-server-miro.js
```

## WebSocket Events (Future)

The API is designed to support real-time updates via WebSocket connections:

```javascript
// Future implementation
const socket = io('http://localhost:3001');

socket.on('workshop-updated', (workshop) => {
  console.log('Workshop updated:', workshop);
});

socket.on('agenda-generated', (data) => {
  console.log('Agenda ready:', data);
});
```
