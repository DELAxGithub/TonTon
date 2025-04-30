import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAIAdvice } from '../hooks/useAIAdvice';
import { useDailySummary } from '../hooks/useDailySummary';

export const AdviceCard = () => {
  const { generateAdvice, getLastAdvice, loading, error } = useAIAdvice();
  const { summary, generateDailySummary } = useDailySummary();
  const [advice, setAdvice] = React.useState(getLastAdvice());

  const handleRefresh = async () => {
    if (!summary) {
      const today = new Date().toISOString().split('T')[0];
      const newSummary = await generateDailySummary(today);
      if (newSummary) {
        const newAdvice = await generateAdvice(newSummary);
        setAdvice(newAdvice);
      }
    } else {
      const newAdvice = await generateAdvice(summary);
      setAdvice(newAdvice);
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>アドバイスを生成中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>再試行</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handleRefresh}>
      <View style={styles.header}>
        <Text style={styles.title}>本日のアドバイス</Text>
        <Text style={styles.date}>
          {advice?.date || new Date().toISOString().split('T')[0]}
        </Text>
      </View>
      <Text style={styles.advice}>
        {advice?.advice || 'タップしてアドバイスを生成'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  advice: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 