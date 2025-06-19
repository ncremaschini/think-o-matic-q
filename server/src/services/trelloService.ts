import axios from 'axios';

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  url: string;
  shortUrl: string;
  dateCreated: string;
}

export interface TrelloTaskRequest {
  title: string;
  description: string;
  dueDate?: string;
  labels?: string[];
}

export interface CreateTasksResponse {
  success: boolean;
  cards: TrelloCard[];
  boardUrl: string;
  message: string;
}

class TrelloService {
  private apiKey: string;
  private apiToken: string;
  private baseUrl = 'https://api.trello.com/1';

  constructor() {
    this.apiKey = process.env.TRELLO_API_KEY || '';
    this.apiToken = process.env.TRELLO_API_SECRET || '';
    
    if (!this.apiKey || !this.apiToken) {
      console.warn('Trello API credentials not configured. Trello integration will be simulated.');
    }
  }

  private isConfigured(): boolean {
    return !!(this.apiKey && this.apiToken);
  }

  /**
   * Create multiple Trello cards from workshop action items
   */
  async createTasksFromAnalysis(
    workshopTitle: string,
    actionItems: string[],
    boardId?: string,
    listId?: string
  ): Promise<CreateTasksResponse> {
    const targetBoardId = boardId || process.env.TRELLO_DEFAULT_BOARD_ID;
    const targetListId = listId || process.env.TRELLO_DEFAULT_LIST_ID;

    if (!this.isConfigured()) {
      return this.simulateTaskCreation(workshopTitle, actionItems, targetBoardId);
    }

    if (!targetBoardId || !targetListId) {
      throw new Error('Trello board ID and list ID are required');
    }

    try {
      // Verify board and list exist
      await this.verifyBoardAndList(targetBoardId, targetListId);

      // Create cards for each action item
      const cards: TrelloCard[] = [];
      
      for (const actionItem of actionItems) {
        const card = await this.createCard({
          title: `[${workshopTitle}] ${this.extractTaskTitle(actionItem)}`,
          description: this.formatTaskDescription(actionItem, workshopTitle),
        }, targetBoardId, targetListId);
        
        cards.push(card);
      }

      const boardUrl = `https://trello.com/b/${targetBoardId}`;

      return {
        success: true,
        cards,
        boardUrl,
        message: `Successfully created ${cards.length} tasks in Trello`
      };

    } catch (error) {
      console.error('Error creating Trello tasks:', error);
      throw new Error(`Failed to create Trello tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a single Trello card
   */
  private async createCard(
    task: TrelloTaskRequest, 
    boardId: string, 
    listId: string
  ): Promise<TrelloCard> {
    const url = `${this.baseUrl}/cards`;
    
    const params = {
      key: this.apiKey,
      token: this.apiToken,
      idList: listId,
      name: task.title,
      desc: task.description,
      pos: 'bottom'
    };

    if (task.dueDate) {
      (params as any).due = task.dueDate;
    }

    const response = await axios.post(url, null, { params });
    
    return {
      id: response.data.id,
      name: response.data.name,
      desc: response.data.desc,
      url: response.data.url,
      shortUrl: response.data.shortUrl,
      dateCreated: response.data.dateLastActivity
    };
  }

  /**
   * Verify that board and list exist and are accessible
   */
  private async verifyBoardAndList(boardId: string, listId: string): Promise<void> {
    // Check board exists and get board info
    const boardUrl = `${this.baseUrl}/boards/${boardId}`;
    const boardResponse = await axios.get(boardUrl, {
      params: {
        key: this.apiKey,
        token: this.apiToken
      }
    });

    // Check list exists and belongs to board
    const listUrl = `${this.baseUrl}/lists/${listId}`;
    const listResponse = await axios.get(listUrl, {
      params: {
        key: this.apiKey,
        token: this.apiToken
      }
    });

    // Check if list belongs to board (compare with both full ID and short URL)
    const listBoardId = listResponse.data.idBoard;
    const boardFullId = boardResponse.data.id;
    const boardShortUrl = boardResponse.data.shortUrl?.split('/').pop(); // Extract short ID from URL
    
    if (listBoardId !== boardFullId && listBoardId !== boardId && boardId !== boardShortUrl) {
      throw new Error(`List does not belong to the specified board. List board: ${listBoardId}, Provided board: ${boardId}, Board full ID: ${boardFullId}`);
    }
  }

  /**
   * Extract a concise task title from action item text
   */
  private extractTaskTitle(actionItem: string): string {
    // Remove markdown formatting and extract first sentence or key phrase
    const cleaned = actionItem
      .replace(/[#*`_]/g, '') // Remove markdown
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .trim();
    
    // Take first sentence or first 60 characters
    const firstSentence = cleaned.split(/[.!?]/)[0];
    return firstSentence.length > 60 
      ? firstSentence.substring(0, 57) + '...'
      : firstSentence;
  }

  /**
   * Format task description with context
   */
  private formatTaskDescription(actionItem: string, workshopTitle: string): string {
    return `**Action Item from Workshop: ${workshopTitle}**

${actionItem}

---
*Created automatically by Think-o-matic*
*Date: ${new Date().toLocaleDateString()}*`;
  }

  /**
   * Simulate task creation for development/demo purposes
   */
  private simulateTaskCreation(
    workshopTitle: string, 
    actionItems: string[], 
    boardId?: string
  ): CreateTasksResponse {
    const cards: TrelloCard[] = actionItems.map((item, index) => ({
      id: `simulated-card-${Date.now()}-${index}`,
      name: `[${workshopTitle}] ${this.extractTaskTitle(item)}`,
      desc: this.formatTaskDescription(item, workshopTitle),
      url: `https://trello.com/c/simulated-${index}`,
      shortUrl: `https://trello.com/c/sim${index}`,
      dateCreated: new Date().toISOString()
    }));

    return {
      success: true,
      cards,
      boardUrl: boardId ? `https://trello.com/b/${boardId}` : 'https://trello.com/demo-board',
      message: `Simulated creation of ${cards.length} tasks (Trello API not configured)`
    };
  }

  /**
   * Extract action items from workshop analysis text
   */
  extractActionItems(analysisText: string): string[] {
    if (!analysisText || typeof analysisText !== 'string') {
      return [
        'Review workshop outcomes and key decisions',
        'Follow up on participant feedback and suggestions',
        'Implement agreed-upon action items from the session'
      ];
    }

    // Look for common action item patterns
    const actionItems: string[] = [];
    
    // Split into lines and look for action items
    const lines = analysisText.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Look for various action item patterns
      if (
        trimmedLine.match(/^(?:\d+\.?\s*)?(?:Action|TODO|Task|Next step|Follow[- ]?up):\s*(.+)/i) ||
        trimmedLine.match(/^[-*]\s*(.+)/) ||
        trimmedLine.match(/^\d+\.\s*(.+)/)
      ) {
        const match = trimmedLine.match(/^(?:\d+\.?\s*)?(?:Action|TODO|Task|Next step|Follow[- ]?up):\s*(.+)/i) ||
                     trimmedLine.match(/^[-*]\s*(.+)/) ||
                     trimmedLine.match(/^\d+\.\s*(.+)/);
        
        if (match && match[1]) {
          const item = match[1].trim();
          if (item.length > 10 && !actionItems.includes(item)) {
            actionItems.push(item);
          }
        }
      }
    }

    // If no structured action items found, create generic ones
    if (actionItems.length === 0) {
      actionItems.push(
        'Review workshop outcomes and key decisions',
        'Follow up on participant feedback and suggestions',
        'Implement agreed-upon action items from the session'
      );
    }

    return actionItems.slice(0, 10); // Limit to 10 items max
  }
}

export const trelloService = new TrelloService();
