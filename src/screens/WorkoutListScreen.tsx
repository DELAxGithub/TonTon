import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CalorieUtils, WorkoutRecord } from '../utils/calorie';
import { SwipeableRow } from '../components/SwipeableRow';

const WorkoutListScreen = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkouts = async () => {
    setIsLoading(true);
    try {
      const data = await CalorieUtils.getWorkouts();
      setWorkouts(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      Alert.alert('エラー', '運動データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const handleEdit = (workout: WorkoutRecord) => {
    navigation.navigate('EditWorkout' as never, { workout } as never);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      '削除の確認',
      'この運動データを削除してもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await CalorieUtils.deleteWorkout(id);
              await loadWorkouts();
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
            }
          },
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const renderItem = ({ item }: { item: WorkoutRecord }) => {
    const createdAt = new Date(item.createdAt);
    const timeString = createdAt.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <SwipeableRow
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item.id)}
      >
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.timeText}>{timeString}</Text>
            <Text style={styles.caloriesText}>{item.calories} kcal</Text>
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.typeText}>{item.type}</Text>
            <Text style={styles.durationText}>{item.duration}分</Text>
          </View>
        </View>
      </SwipeableRow>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>運動記録がありません</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddWorkout' as never)}
      >
        <Text style={styles.addButtonText}>＋ 運動を記録</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    color: '#333',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#f4511e',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutListScreen; 