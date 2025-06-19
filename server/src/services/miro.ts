import axios, { AxiosInstance } from 'axios';
import fs from 'fs';
import path from 'path';
import { Workshop, WorkshopType } from '../types/workshop';

interface MiroBoard {
  id: string;
  name: string;
  viewLink: string;
  sharingPolicy?: {
    access: string;
    inviteToAccountAndBoardLinkAccess: string;
  };
}

interface MiroTemplate {
  id: string;
  name: string;
  description?: string;
}

export class MiroService {
  private client: AxiosInstance;
  private accessToken: string;
  private workspaceId: string;
  private cookies: string;

  constructor() {
    console.log('🧪 Initializing MiroService...');
    
    this.accessToken = process.env.MIRO_ACCESS_TOKEN || '';
    this.workspaceId = process.env.MIRO_DEFAULT_WORKSPACE_ID || '';
    
    console.log('🔑 Access token:', this.accessToken ? 'Found' : 'Missing');
    console.log('📋 Workspace ID:', this.workspaceId ? 'Found' : 'Missing');
    
    // Load cookies from parent directory
    this.cookies = this.loadCookies();
    
    this.client = axios.create({
      baseURL: 'https://api.miro.com/v2',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Cookie': this.cookies
      }
    });
    
    console.log('✅ MiroService initialized successfully');
  }

  private loadCookies(): string {
    try {
      const cookiesPath = path.join(__dirname, '../../../..', 'cookies.txt');
      const cookiesContent = fs.readFileSync(cookiesPath, 'utf-8');
      
      // Parse cookies.txt format (Netscape format) and convert to header format
      const cookieLines = cookiesContent.split('\n').filter(line => 
        line.trim() && !line.startsWith('#')
      );
      
      const cookies = cookieLines.map(line => {
        const parts = line.split('\t');
        if (parts.length >= 7) {
          const name = parts[5];
          const value = parts[6];
          return `${name}=${value}`;
        }
        return '';
      }).filter(Boolean);
      
      return cookies.join('; ');
    } catch (error) {
      console.warn('Could not load cookies.txt, using token-only authentication:', error);
      return '';
    }
  }

  async createBoardFromTemplate(workshop: Workshop): Promise<{ id: string; url: string }> {
    try {
      console.log('🧪 Creating Miro board for workshop:', workshop.title);
      
      // Get appropriate template based on workshop type
      const templateId = this.getTemplateIdForWorkshopType(workshop.type);
      console.log('📋 Template ID:', templateId);
      
      if (!templateId || templateId === 'empty') {
        throw new Error(`No template found for workshop type: ${workshop.type}`);
      }

      // Clean the template ID to remove any formatting issues
      const cleanTemplateId = templateId.replace(/[^a-zA-Z0-9+=]/g, '');
      
      // Create board data with minimal required fields
      const boardData = {
        name: `${workshop.title} - ${new Date(workshop.dateTime).toLocaleDateString()}`,
        description: `Workshop: ${workshop.goal}\n\nExpected Outcomes: ${workshop.expectedOutcomes}`
      };

      console.log('📋 Creating board from template with data:', JSON.stringify(boardData, null, 2));

      // Use the configured client with proper headers
      const response = await this.client.put(`/boards?copy_from=${cleanTemplateId}`, boardData);
      const board = response.data;
      
      console.log('✅ Board created from template successfully:', board.id);

      // Wait a moment for the board to be fully created
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add workshop-specific content
      await this.addWorkshopContent(board.id, workshop);

      return {
        id: board.id,
        url: board.viewLink || board.url || `https://miro.com/app/board/${board.id}/`
      };
    } catch (error: any) {
      console.error('❌ Error creating Miro board from template:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw new Error('Failed to create Miro board from template');
    }
  }

  private getTemplateIdForWorkshopType(type: WorkshopType): string | null {
    // Map workshop types to Miro template IDs from your environment
    const templateMap: Record<WorkshopType, string> = {
      [WorkshopType.BRAINSTORMING]: process.env.MIRO_TEMPLATE_BRAINSTORMING || 'empty',
      [WorkshopType.RETROSPECTIVE]: process.env.MIRO_TEMPLATE_RETROSPECTIVE || 'empty',
      [WorkshopType.PLANNING]: process.env.MIRO_TEMPLATE_PLANNING || 'empty',
      [WorkshopType.DESIGN_THINKING]: process.env.MIRO_TEMPLATE_DESIGN_THINKING || 'empty',
      [WorkshopType.PROBLEM_SOLVING]: process.env.MIRO_TEMPLATE_PROBLEM_SOLVING || 'empty',
      [WorkshopType.TEAM_BUILDING]: process.env.MIRO_TEMPLATE_TEAM_BUILDING || 'empty'
    };

    return templateMap[type] || 'empty';
  }

  private async addWorkshopContent(boardId: string, workshop: Workshop): Promise<void> {
    try {
      console.log('📝 Adding workshop content to board...');
      
      // Add a title sticky note with correct format
      const stickyNote = {
        data: {
          content: `<p><strong>${workshop.title}</strong></p>`,
          shape: 'square',
          style: {
            fillColor: 'yellow'
          }
        },
        geometry: {
          width: 200,
          height: 100
        },
        position: {
          x: 0,
          y: -400,
          origin: 'center'
        }
      };

      console.log('📋 Creating sticky note with data:', JSON.stringify(stickyNote, null, 2));
      
      const response = await this.client.post(`/boards/${boardId}/sticky_notes`, stickyNote);
      console.log('✅ Sticky note created:', response.data.id);

      // Add agenda if available
      if (workshop.agenda) {
        const agendaNote = {
          data: {
            content: `<p><strong>Agenda</strong></p><p>${workshop.agenda.replace(/\n/g, '<br>')}</p>`,
            shape: 'square',
            style: {
              fillColor: 'blue'
            }
          },
          geometry: {
            width: 300,
            height: 200
          },
          position: {
            x: -300,
            y: -400,
            origin: 'center'
          }
        };
        
        await this.client.post(`/boards/${boardId}/sticky_notes`, agendaNote);
        console.log('✅ Agenda note created');
      }

    } catch (error: any) {
      console.warn('⚠️ Could not add workshop content to board:', error.response?.data || error.message);
      // Don't throw here, board creation was successful
    }
  }

  async getBoardContent(boardId: string): Promise<string> {
    try {
      console.log('🔍 Extracting comprehensive board content...');
      
      // Get all different types of content from the board
      const [stickyNotesResponse, textItemsResponse, shapesResponse] = await Promise.allSettled([
        this.client.get(`/boards/${boardId}/sticky_notes`),
        this.client.get(`/boards/${boardId}/texts`),
        this.client.get(`/boards/${boardId}/shapes`)
      ]);

      let contentSections = [];

      // Extract sticky notes
      if (stickyNotesResponse.status === 'fulfilled') {
        const stickyNotes = stickyNotesResponse.value.data.data || [];
        if (stickyNotes.length > 0) {
          const notesContent = stickyNotes.map((note: any) => {
            const text = note.data.content.replace(/<[^>]*>/g, ''); // Strip HTML
            const color = note.style?.fillColor || 'default';
            return `[Sticky Note - ${color}]: ${text}`;
          }).join('\n');
          
          contentSections.push(`=== STICKY NOTES ===\n${notesContent}`);
          console.log(`📝 Found ${stickyNotes.length} sticky notes`);
        }
      }

      // Extract text items
      if (textItemsResponse.status === 'fulfilled') {
        const textItems = textItemsResponse.value.data.data || [];
        if (textItems.length > 0) {
          const textsContent = textItems.map((text: any) => {
            const content = text.data.content.replace(/<[^>]*>/g, ''); // Strip HTML
            return `[Text]: ${content}`;
          }).join('\n');
          
          contentSections.push(`=== TEXT ITEMS ===\n${textsContent}`);
          console.log(`📄 Found ${textItems.length} text items`);
        }
      }

      // Extract shapes with text
      if (shapesResponse.status === 'fulfilled') {
        const shapes = shapesResponse.value.data.data || [];
        const shapesWithText = shapes.filter((shape: any) => shape.data && shape.data.content);
        if (shapesWithText.length > 0) {
          const shapesContent = shapesWithText.map((shape: any) => {
            const content = shape.data.content.replace(/<[^>]*>/g, ''); // Strip HTML
            const shapeType = shape.data.shape || 'shape';
            return `[${shapeType}]: ${content}`;
          }).join('\n');
          
          contentSections.push(`=== SHAPES WITH TEXT ===\n${shapesContent}`);
          console.log(`🔷 Found ${shapesWithText.length} shapes with text`);
        }
      }

      // Combine all content
      const fullContent = contentSections.join('\n\n');
      
      if (!fullContent.trim()) {
        console.log('⚠️ No content found on the board');
        return 'No content found on the board. The board appears to be empty or contains only visual elements without text.';
      }

      console.log('✅ Board content extracted successfully');
      console.log(`📊 Total content length: ${fullContent.length} characters`);
      
      return fullContent;
    } catch (error) {
      console.error('Error getting board content:', error);
      throw new Error('Failed to retrieve board content');
    }
  }

  async listTemplates(): Promise<MiroTemplate[]> {
    try {
      // This would list available templates in the workspace
      // For now, return a mock list based on workshop types
      return [
        { id: 'brainstorming', name: 'Brainstorming Template' },
        { id: 'retrospective', name: 'Retrospective Template' },
        { id: 'planning', name: 'Planning Template' },
        { id: 'design-thinking', name: 'Design Thinking Template' },
        { id: 'problem-solving', name: 'Problem Solving Template' },
        { id: 'team-building', name: 'Team Building Template' }
      ];
    } catch (error) {
      console.error('Error listing templates:', error);
      return [];
    }
  }
}
