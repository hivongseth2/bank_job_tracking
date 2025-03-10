import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../styles';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  outline = false, 
  loading = false,
  disabled = false,
  icon = null
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        outline && styles.buttonOutline,
        disabled && styles.buttonDisabled,
        style
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : colors.white} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text 
            style={[
              styles.buttonText, 
              outline && styles.buttonOutlineText,
              disabled && styles.buttonDisabledText,
              textStyle
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonOutlineText: {
    color: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  buttonDisabledText: {
    color: colors.white,
  },
});

export default Button;