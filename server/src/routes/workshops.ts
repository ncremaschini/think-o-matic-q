import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Workshop, WorkshopStatus, CreateWorkshopRequest } from '../types/workshop';
import { StorageService } from '../services/storage';
import { BedrockService } from '../services/bedrock';
import { MiroService } from '../services/miro';
import { trelloService } from '../services/trelloService';

const router = express.Router();
const storage = new StorageService();
const bedrock = new BedrockService();
const miro = new MiroService();

// Get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await storage.getAllWorkshops();
    res.json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
});

// Get workshop by ID
router.get('/:id', async (req, res) => {
  try {
    const workshop = await storage.getWorkshopById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }
    res.json(workshop);
  } catch (error) {
    console.error('Error fetching workshop:', error);
    res.status(500).json({ error: 'Failed to fetch workshop' });
  }
});

// Create new workshop
router.post('/', async (req, res) => {
  try {
    const createRequest: CreateWorkshopRequest = req.body;
    
    const workshop: Workshop = {
      id: uuidv4(),
      ...createRequest,
      status: WorkshopStatus.CREATED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedWorkshop = await storage.saveWorkshop(workshop);
    res.status(201).json(savedWorkshop);
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ error: 'Failed to create workshop' });
  }
});

// Generate agenda for workshop
router.post('/:id/generate-agenda', async (req, res) => {
  try {
    const workshop = await storage.getWorkshopById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    const agenda = await bedrock.generateAgenda(workshop);
    
    workshop.agenda = agenda;
    workshop.status = WorkshopStatus.AGENDA_GENERATED;
    
    const updatedWorkshop = await storage.saveWorkshop(workshop);
    res.json(updatedWorkshop);
  } catch (error) {
    console.error('Error generating agenda:', error);
    res.status(500).json({ error: 'Failed to generate agenda' });
  }
});

// Update workshop
router.put('/:id', async (req, res) => {
  try {
    const workshop = await storage.getWorkshopById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    // Update workshop fields
    const updatedWorkshop = {
      ...workshop,
      ...req.body,
      id: workshop.id, // Preserve ID
      status: workshop.status, // Preserve status
      createdAt: workshop.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
      // Preserve existing data that shouldn't be overwritten
      agenda: workshop.agenda,
      miroBoard: workshop.miroBoard,
      analysis: workshop.analysis,
    };

    const savedWorkshop = await storage.saveWorkshop(updatedWorkshop);
    console.log(`✅ Workshop ${workshop.id} updated`);
    
    res.json(savedWorkshop);
  } catch (error) {
    console.error('Error updating workshop:', error);
    res.status(500).json({ error: 'Failed to update workshop' });
  }
});

// Update workshop status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const workshop = await storage.getWorkshopById(req.params.id);
    
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    workshop.status = status;
    const updatedWorkshop = await storage.saveWorkshop(workshop);
    res.json(updatedWorkshop);
  } catch (error) {
    console.error('Error updating workshop status:', error);
    res.status(500).json({ error: 'Failed to update workshop status' });
  }
});

// Update workshop agenda
router.patch('/:id/agenda', async (req, res) => {
  try {
    const { agenda } = req.body;
    const workshop = await storage.getWorkshopById(req.params.id);
    
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    workshop.agenda = agenda;
    workshop.status = WorkshopStatus.AGENDA_APPROVED;
    const updatedWorkshop = await storage.saveWorkshop(workshop);
    res.json(updatedWorkshop);
  } catch (error) {
    console.error('Error updating workshop agenda:', error);
    res.status(500).json({ error: 'Failed to update workshop agenda' });
  }
});

// Create Miro board for workshop
router.post('/:id/create-miro-board', async (req, res) => {
  try {
    const workshop = await storage.getWorkshopById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    // Check if workshop has an approved agenda
    if (workshop.status !== WorkshopStatus.AGENDA_APPROVED && !workshop.agenda) {
      return res.status(400).json({ error: 'Workshop must have an approved agenda before creating Miro board' });
    }

    const miroBoard = await miro.createBoardFromTemplate(workshop);
    
    workshop.miroBoard = miroBoard;
    workshop.status = WorkshopStatus.MIRO_BOARD_CREATED;
    workshop.updatedAt = new Date().toISOString();
    
    const updatedWorkshop = await storage.saveWorkshop(workshop);
    res.json(updatedWorkshop);
  } catch (error) {
    console.error('Error creating Miro board:', error);
    res.status(500).json({ error: 'Failed to create Miro board' });
  }
});

// Mark workshop as conducted
router.patch('/:id/mark-conducted', async (req, res) => {
  try {
    const workshop = await storage.getWorkshopById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    if (workshop.status !== WorkshopStatus.MIRO_BOARD_CREATED) {
      return res.status(400).json({ error: 'Workshop must have a Miro board before being marked as conducted' });
    }

    workshop.status = WorkshopStatus.WORKSHOP_CONDUCTED;
    workshop.updatedAt = new Date().toISOString();

    const updatedWorkshop = await storage.saveWorkshop(workshop);
    console.log(`✅ Workshop ${workshop.id} marked as conducted`);
    
    res.json(updatedWorkshop);
  } catch (error) {
    console.error('Error marking workshop as conducted:', error);
    res.status(500).json({ error: 'Failed to mark workshop as conducted' });
  }
});

// Analyze workshop content from Miro board
router.post('/:id/analyze', async (req, res) => {
  try {
    const workshop = await storage.getWorkshopById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    if (!workshop.miroBoard) {
      return res.status(400).json({ error: 'Workshop must have a Miro board before analysis' });
    }

    // Get content from Miro board
    const boardContent = await miro.getBoardContent(workshop.miroBoard.id);
    
    // Analyze with Bedrock
    const analysis = await bedrock.analyzeWorkshop(boardContent);
    
    workshop.analysis = analysis;
    workshop.status = WorkshopStatus.ANALYSIS_COMPLETED;
    workshop.updatedAt = new Date().toISOString();
    
    const updatedWorkshop = await storage.saveWorkshop(workshop);
    res.json(updatedWorkshop);
  } catch (error) {
    console.error('Error analyzing workshop:', error);
    res.status(500).json({ error: 'Failed to analyze workshop' });
  }
});

// Delete workshop
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await storage.deleteWorkshop(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Workshop not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({ error: 'Failed to delete workshop' });
  }
});

// Create Trello tasks from workshop analysis
router.post('/:id/create-tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await storage.getWorkshopById(id);
    
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    if (!workshop.analysis) {
      return res.status(400).json({ error: 'Workshop analysis not available. Please complete analysis first.' });
    }

    // Extract action items from analysis
    const actionItems = trelloService.extractActionItems(workshop.analysis);
    
    if (actionItems.length === 0) {
      return res.status(400).json({ error: 'No action items found in workshop analysis' });
    }

    // Create Trello tasks
    const result = await trelloService.createTasksFromAnalysis(
      workshop.title,
      actionItems,
      workshop.trelloBoardId,
      workshop.trelloListId
    );

    // Update workshop status and store task information
    const updatedWorkshop: Workshop = {
      ...workshop,
      status: WorkshopStatus.TASKS_CREATED,
      trelloTasks: {
        cards: result.cards,
        boardUrl: result.boardUrl,
        createdAt: new Date().toISOString(),
        actionItems: actionItems
      }
    };

    await storage.saveWorkshop(updatedWorkshop);

    res.json({
      success: true,
      workshop: updatedWorkshop,
      tasksCreated: result.cards.length,
      boardUrl: result.boardUrl,
      message: result.message
    });

  } catch (error) {
    console.error('Error creating Trello tasks:', error);
    res.status(500).json({ 
      error: 'Failed to create Trello tasks',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
