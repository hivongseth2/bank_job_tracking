import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../styles';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = ({ 
  message = 'Không có dữ liệu', 
  subMessage = null, 
  icon = 'alert-circle-outline',
  buttonText = null,
  onButtonPress = null,
  imageSource = null
}) => {
  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image 
          source={imageSource} 
          style={styles.image} 
          resizeMode="contain" 
        />
      ) : (
        <Ionicons name={icon} size={80} color={colors.textSecondary} />
      )}
      
      <Text style={styles.message}>{message}</Text>
      
      {subMessage && (
        <Text style={styles.subMessage}>{subMessage}</Text>
      )}
      
      {buttonText && onButtonPress && (
        <Button 
          title={buttonText} 
          onPress={onButtonPress} 
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 16,
  },
});

export default EmptyState;