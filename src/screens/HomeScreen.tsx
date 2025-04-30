import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import MonthlySavingProgress from '../components/home/MonthlySavingProgress';
import TodayBalance from '../components/home/TodayBalance';
import YesterdayBalance from '../components/home/YesterdayBalance';
import BottomNavBar from '../components/common/BottomNavBar';
import mockData from '../mocks/dailyData';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>TonTon</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </Text>
      </View>

      {/* メインコンテンツ */}
      <ScrollView style={styles.content}>
        <MonthlySavingProgress data={mockData.monthly} />
        <TodayBalance data={mockData.today} />
        <YesterdayBalance data={mockData.yesterday} />
      </ScrollView>

      {/* ナビゲーションバー */}
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default HomeScreen; 