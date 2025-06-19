import fs from 'fs/promises';
import path from 'path';
import { Workshop } from '../types/workshop';

const DATA_DIR = path.join(__dirname, '../../data');
const WORKSHOPS_FILE = path.join(DATA_DIR, 'workshops.json');

export class StorageService {
  constructor() {
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  async getAllWorkshops(): Promise<Workshop[]> {
    try {
      const data = await fs.readFile(WORKSHOPS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getWorkshopById(id: string): Promise<Workshop | null> {
    const workshops = await this.getAllWorkshops();
    return workshops.find(w => w.id === id) || null;
  }

  async saveWorkshop(workshop: Workshop): Promise<Workshop> {
    const workshops = await this.getAllWorkshops();
    const existingIndex = workshops.findIndex(w => w.id === workshop.id);
    
    workshop.updatedAt = new Date().toISOString();
    
    if (existingIndex >= 0) {
      workshops[existingIndex] = workshop;
    } else {
      workshops.push(workshop);
    }

    await fs.writeFile(WORKSHOPS_FILE, JSON.stringify(workshops, null, 2));
    return workshop;
  }

  async deleteWorkshop(id: string): Promise<boolean> {
    const workshops = await this.getAllWorkshops();
    const filteredWorkshops = workshops.filter(w => w.id !== id);
    
    if (filteredWorkshops.length === workshops.length) {
      return false; // Workshop not found
    }

    await fs.writeFile(WORKSHOPS_FILE, JSON.stringify(filteredWorkshops, null, 2));
    return true;
  }
}
