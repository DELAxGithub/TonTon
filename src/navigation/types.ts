import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  AddMeal: undefined;
  AddWorkout: undefined;
  Settings: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>; 