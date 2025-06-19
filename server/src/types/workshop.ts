export interface Workshop {
  id: string;
  title: string;
  goal: string;
  type: WorkshopType;
  expectedOutcomes: string;
  dateTime: string;
  duration: number; // in minutes
  participantCount: number;
  participantTypes: string;
  miroWorkspaceId?: string;
  trelloBoardId?: string;
  trelloListId?: string;
  status: WorkshopStatus;
  agenda?: string;
  miroBoard?: {
    id: string;
    url: string;
  };
  analysis?: {
    summary: {
      brief: string;
      detailed: string;
    };
    sentiment: {
      overall: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
      score: number;
      explanation: string;
    };
    participation: {
      level: 'HIGH' | 'MEDIUM' | 'LOW';
      evidence: string;
    };
    actionItems: Array<{
      task: string;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      category: 'Technical' | 'Process' | 'Research' | 'Other';
    }>;
    keyThemes: Array<{
      theme: string;
      frequency: number;
      context: string;
    }>;
    recommendations: string[];
  };
  trelloTasks?: {
    cards: Array<{
      id: string;
      name: string;
      desc: string;
      url: string;
      shortUrl: string;
      dateCreated: string;
    }>;
    boardUrl: string;
    createdAt: string;
    actionItems: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export enum WorkshopType {
  BRAINSTORMING = 'brainstorming',
  RETROSPECTIVE = 'retrospective',
  PLANNING = 'planning',
  DESIGN_THINKING = 'design-thinking',
  PROBLEM_SOLVING = 'problem-solving',
  TEAM_BUILDING = 'team-building'
}

export enum WorkshopStatus {
  CREATED = 'created',
  AGENDA_GENERATED = 'agenda-generated',
  AGENDA_APPROVED = 'agenda-approved',
  MIRO_BOARD_CREATED = 'miro-board-created',
  WORKSHOP_CONDUCTED = 'workshop-conducted',
  ANALYSIS_COMPLETED = 'analysis-completed',
  TASKS_CREATED = 'tasks-created'
}

export interface CreateWorkshopRequest {
  title: string;
  goal: string;
  type: WorkshopType;
  expectedOutcomes: string;
  dateTime: string;
  duration: number;
  participantCount: number;
  participantTypes: string;
  miroWorkspaceId?: string;
  trelloBoardId?: string;
  trelloListId?: string;
}
