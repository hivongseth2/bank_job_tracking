import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../styles';

const Loading = ({ message = 'Đang tải...', fullScreen = true }) => {
  if (!fullScreen) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.primary} />
        {message && <Text style={styles.text}>{message}</Text>}
      </View>
    );
  }
  
  return (
    <View style={styles.fullScreenContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default Loading;