import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';

const HealthKitTest = () => {
  const [status, setStatus] = useState(`プラットフォーム: ${Platform.OS}`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HealthKit テスト</Text>
      <Text style={styles.status}>状態: {status}</Text>
      <Button
        title="テストボタン"
        onPress={() => {
          setStatus('ボタンが押されました');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default HealthKitTest; 