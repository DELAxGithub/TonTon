import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/types';

export const ActionButtons = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.recordButtons}>
        <TouchableOpacity 
          style={[styles.recordButton, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('AddMeal')}
        >
          <Text style={styles.recordButtonText}>食事記録</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.recordButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('Workout')}
        >
          <Text style={styles.recordButtonText}>運動記録</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.recordButton, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('Weight')}
        >
          <Text style={styles.recordButtonText}>体重記録</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('MonthlyData')}
        >
          <Text style={styles.buttonText}>月別データを見る</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.settingsButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>設定</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  recordButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recordButton: {
    flex: 1,
    margin: 6,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 