import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnergyRecord } from '../types/records';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export class EnergyStorage {
  private static readonly ENERGY_RECORDS_KEY = '@energy_records';

  static async saveEnergyRecord(record: EnergyRecord): Promise<void> {
    try {
      const records = await this.getAllEnergyRecords();
      records.push(record);
      await AsyncStorage.setItem(this.ENERGY_RECORDS_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving energy record:', error);
      throw error;
    }
  }

  static async getDailyEnergyRecords(date: string): Promise<EnergyRecord[]> {
    try {
      const records = await this.getAllEnergyRecords();
      return records.filter(record => record.date === date);
    } catch (error) {
      console.error('Error getting daily energy records:', error);
      throw error;
    }
  }

  static async getAllEnergyRecords(): Promise<EnergyRecord[]> {
    try {
      const recordsJson = await AsyncStorage.getItem(this.ENERGY_RECORDS_KEY);
      return recordsJson ? JSON.parse(recordsJson) : [];
    } catch (error) {
      console.error('Error getting all energy records:', error);
      throw error;
    }
  }

  static async clearEnergyRecords(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.ENERGY_RECORDS_KEY);
    } catch (error) {
      console.error('Error clearing energy records:', error);
      throw error;
    }
  }

  // 新規記録の追加
  static async addEnergyRecord(type: 'active' | 'total', value: number, date?: string): Promise<EnergyRecord> {
    const records = await EnergyStorage.getAllEnergyRecords();
    const now = new Date();
    
    const newRecord: EnergyRecord = {
      id: uuidv4(),
      date: date || format(now, 'yyyy-MM-dd'),
      type,
      value,
      source: 'manual',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // 同じ日付・タイプの記録が既に存在する場合は上書き
    const existingIndex = records.findIndex(
      r => r.date === newRecord.date && r.type === newRecord.type
    );

    if (existingIndex >= 0) {
      records[existingIndex] = newRecord;
    } else {
      records.push(newRecord);
    }

    await AsyncStorage.setItem(EnergyStorage.ENERGY_RECORDS_KEY, JSON.stringify(records));
    return newRecord;
  }

  // 記録の更新
  static async updateEnergyRecord(id: string, value: number): Promise<EnergyRecord> {
    const records = await EnergyStorage.getAllEnergyRecords();
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('記録が見つかりません');
    }

    const updatedRecord: EnergyRecord = {
      ...records[index],
      value,
      updatedAt: new Date().toISOString(),
    };

    records[index] = updatedRecord;
    await AsyncStorage.setItem(EnergyStorage.ENERGY_RECORDS_KEY, JSON.stringify(records));
    return updatedRecord;
  }

  // 記録の削除
  static async deleteEnergyRecord(id: string): Promise<void> {
    const records = await EnergyStorage.getAllEnergyRecords();
    const filtered = records.filter(r => r.id !== id);
    await AsyncStorage.setItem(EnergyStorage.ENERGY_RECORDS_KEY, JSON.stringify(filtered));
  }
} 