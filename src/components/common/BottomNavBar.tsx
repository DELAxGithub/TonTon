import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Home', icon: '🏠', route: 'Home' },
    { name: 'Weight', icon: '⚖️', route: 'Weight' },
    { name: 'Meal', icon: '🍽️', route: 'Meal' },
    { name: 'Workout', icon: '🏃', route: 'Workout' },
    { name: 'Record', icon: '📊', route: 'Record' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[
            styles.tab,
            route.name === tab.route && styles.activeTab,
          ]}
          onPress={() => navigation.navigate(tab.route as never)}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text style={[
            styles.label,
            route.name === tab.route && styles.activeLabel,
          ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingBottom: 20, // iPhoneのホームバー対応
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#f8f8f8',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666666',
  },
  activeLabel: {
    color: '#f4511e',
  },
});

export default BottomNavBar; 