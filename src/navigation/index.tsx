import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import AddMealScreen from '../screens/AddMealScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'トントン' }}
        />
        <Stack.Screen 
          name="AddMeal" 
          component={AddMealScreen}
          options={{ title: '食事を記録' }}
        />
        <Stack.Screen 
          name="AddWorkout" 
          component={AddWorkoutScreen}
          options={{ title: '運動を記録' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: '設定' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 