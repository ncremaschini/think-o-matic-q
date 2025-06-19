import axios from 'axios';
import { Workshop, CreateWorkshopRequest, WorkshopStatus } from '../types/workshop';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const workshopApi = {
  // Get all workshops
  getAll: async (): Promise<Workshop[]> => {
    const response = await api.get('/workshops');
    return response.data;
  },

  // Get workshop by ID
  getById: async (id: string): Promise<Workshop> => {
    const response = await api.get(`/workshops/${id}`);
    return response.data;
  },

  // Create new workshop
  create: async (workshop: CreateWorkshopRequest): Promise<Workshop> => {
    const response = await api.post('/workshops', workshop);
    return response.data;
  },

  // Generate agenda
  generateAgenda: async (id: string): Promise<Workshop> => {
    const response = await api.post(`/workshops/${id}/generate-agenda`);
    return response.data;
  },

  // Update workshop
  update: async (id: string, workshop: CreateWorkshopRequest): Promise<Workshop> => {
    const response = await api.put(`/workshops/${id}`, workshop);
    return response.data;
  },

  // Update workshop status
  updateStatus: async (id: string, status: WorkshopStatus): Promise<Workshop> => {
    const response = await api.patch(`/workshops/${id}/status`, { status });
    return response.data;
  },

  // Update workshop agenda
  updateAgenda: async (id: string, agenda: string): Promise<Workshop> => {
    const response = await api.patch(`/workshops/${id}/agenda`, { agenda });
    return response.data;
  },

  // Create Miro board
  createMiroBoard: async (id: string): Promise<Workshop> => {
    const response = await api.post(`/workshops/${id}/create-miro-board`);
    return response.data;
  },

  // Create Trello tasks
  createTasks: async (id: string): Promise<Workshop> => {
    const response = await api.post(`/workshops/${id}/create-tasks`);
    return response.data;
  },

  // Mark workshop as conducted
  markAsConducted: async (id: string): Promise<Workshop> => {
    const response = await api.patch(`/workshops/${id}/mark-conducted`);
    return response.data;
  },

  // Analyze workshop
  analyzeWorkshop: async (id: string): Promise<Workshop> => {
    const response = await api.post(`/workshops/${id}/analyze`);
    return response.data;
  },

  // Delete workshop
  delete: async (id: string): Promise<void> => {
    await api.delete(`/workshops/${id}`);
  },
};

export default api;
