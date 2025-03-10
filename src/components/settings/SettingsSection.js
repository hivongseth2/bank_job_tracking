import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles';
import Card from '../common/Card';

const SettingsSection = ({ 
  title, 
  children, 
  style, 
  titleStyle,
  footer = null
}) => {
  return (
    <View style={[styles.container, style]}>
      {title && (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      )}
      
      <Card style={styles.card}>
        {children}
      </Card>
      
      {footer && (
        <Text style={styles.footer}>{footer}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 16,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  footer: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    marginHorizontal: 16,
  },
});

export default SettingsSection;