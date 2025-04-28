import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import AddMealScreen from '../screens/AddMealScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WorkoutListScreen from '../screens/WorkoutListScreen';
import EditWorkoutScreen from '../screens/EditWorkoutScreen';
import { WorkoutRecord } from '../types';

export type RootStackParamList = {
  Home: undefined;
  AddMeal: undefined;
  AddWorkout: undefined;
  Settings: undefined;
  WorkoutList: undefined;
  EditWorkout: { workout: WorkoutRecord };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
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
        <Stack.Screen
          name="WorkoutList"
          component={WorkoutListScreen}
          options={{ title: '運動記録一覧' }}
        />
        <Stack.Screen
          name="EditWorkout"
          component={EditWorkoutScreen}
          options={{ title: '運動データを編集' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 