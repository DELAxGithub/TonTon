import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { EnergyStorage } from '../storage/energyStorage';
import { format } from 'date-fns';

type Props = {
  date?: string;
  onSave?: () => void;
};

export const EnergyInput: React.FC<Props> = ({ date = format(new Date(), 'yyyy-MM-dd'), onSave }) => {
  const [activeCalories, setActiveCalories] = useState('');
  const [totalCalories, setTotalCalories] = useState('');

  const handleSave = async () => {
    try {
      if (activeCalories) {
        await EnergyStorage.addEnergyRecord('active', Number(activeCalories), date);
      }
      if (totalCalories) {
        await EnergyStorage.addEnergyRecord('total', Number(totalCalories), date);
      }
      setActiveCalories('');
      setTotalCalories('');
      onSave?.();
    } catch (error) {
      console.error('エネルギー記録の保存に失敗しました:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>アクティブカロリー</Text>
        <TextInput
          style={styles.input}
          value={activeCalories}
          onChangeText={setActiveCalories}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={styles.unit}>kcal</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>総消費カロリー</Text>
        <TextInput
          style={styles.input}
          value={totalCalories}
          onChangeText={setTotalCalories}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={styles.unit}>kcal</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={!activeCalories && !totalCalories}
      >
        <Text style={styles.buttonText}>保存</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    textAlign: 'right',
  },
  unit: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 