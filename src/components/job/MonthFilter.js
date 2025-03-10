// Trong MonthFilter.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const months = [
  'All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MonthFilter = ({ selectedMonth, onMonthSelect }) => {
  return (
    <View style={styles.container}>
      {months.map((month, index) => (
        <TouchableOpacity
          key={month}
          style={[
            styles.button,
            selectedMonth === (index === 0 ? 'All' : index.toString()) && styles.selectedButton
          ]}
          onPress={() => onMonthSelect(index === 0 ? 'All' : index.toString())}
        >
          <Text style={[
            styles.buttonText,
            selectedMonth === (index === 0 ? 'All' : index.toString()) && styles.selectedButtonText
          ]}>
            {month}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#007AFF',
  },
  selectedButtonText: {
    color: 'white',
  },
});

export default MonthFilter;