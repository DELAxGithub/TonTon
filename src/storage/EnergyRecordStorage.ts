import { EnergyRecord } from '../types/records';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const ENERGY_RECORDS_KEY = 'energy_records';

export class EnergyRecordStorage {
  private async getStoredRecords(): Promise<EnergyRecord[]> {
    try {
      const records = await localStorage.getItem(ENERGY_RECORDS_KEY);
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('Failed to get stored records:', error);
      return [];
    }
  }

  private async saveStoredRecords(records: EnergyRecord[]): Promise<void> {
    try {
      await localStorage.setItem(ENERGY_RECORDS_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save records:', error);
      throw new Error('Failed to save records');
    }
  }

  async saveEnergyRecord(energyLevel: number, note?: string): Promise<EnergyRecord> {
    const records = await this.getStoredRecords();
    const now = new Date();
    
    const newRecord: EnergyRecord = {
      id: uuidv4(),
      date: format(now, 'yyyy-MM-dd'),
      timestamp: now.getTime(),
      energyLevel,
      note
    };

    records.push(newRecord);
    await this.saveStoredRecords(records);
    return newRecord;
  }

  async getDailyEnergyRecords(date: Date): Promise<EnergyRecord[]> {
    const records = await this.getStoredRecords();
    const targetDate = format(date, 'yyyy-MM-dd');
    return records.filter(record => record.date === targetDate);
  }

  async getAllEnergyRecords(): Promise<EnergyRecord[]> {
    return await this.getStoredRecords();
  }

  async clearEnergyRecords(): Promise<void> {
    await localStorage.removeItem(ENERGY_RECORDS_KEY);
  }
} 