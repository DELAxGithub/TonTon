import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface SwipeableRowProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onEdit,
  onDelete,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        <RectButton style={styles.editButton} onPress={handleEdit}>
          <Animated.Text
            style={[styles.actionText, { transform: [{ scale }] }]}
          >
            編集
          </Animated.Text>
        </RectButton>
        <RectButton style={styles.deleteButton} onPress={handleDelete}>
          <Animated.Text
            style={[styles.actionText, { transform: [{ scale }] }]}
          >
            削除
          </Animated.Text>
        </RectButton>
      </View>
    );
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    onEdit();
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={80}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightActions: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    width: 160,
  },
  editButton: {
    width: 80,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 80,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 