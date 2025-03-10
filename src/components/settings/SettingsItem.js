import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { colors } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const SettingsItem = ({ 
  title, 
  subtitle = null, 
  icon = null, 
  iconColor = colors.primary,
  onPress = null, 
  rightComponent = null,
  switchValue = null,
  onSwitchChange = null,
  showArrow = true,
  disabled = false
}) => {
  const isSwitch = switchValue !== null && onSwitchChange !== null;
  const isClickable = onPress !== null && !disabled;
  
  const renderRightComponent = () => {
    if (rightComponent) {
      return rightComponent;
    }
    
    if (isSwitch) {
      return (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: `${colors.primary}50` }}
          thumbColor={switchValue ? colors.primary : '#f4f3f4'}
          disabled={disabled}
        />
      );
    }
    
    if (isClickable && showArrow) {
      return (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      );
    }
    
    return null;
  };
  
  const content = (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}10` }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
      )}
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, disabled && styles.titleDisabled]}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      
      {renderRightComponent()}
    </View>
  );
  
  if (isClickable) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  titleDisabled: {
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default SettingsItem;