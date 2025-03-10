import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const Card = ({ children, style }) => {
  const { colors } = useContext(ThemeContext);
  
  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.glass,
        borderColor: colors.glassBorder,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Card;