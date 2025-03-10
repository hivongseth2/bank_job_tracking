// Trong SourceFilter.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SourceFilter = ({ sources, selectedSource, onSourceSelect }) => {
  return (
    <View style={styles.container}>
      {sources.map(source => (
        <TouchableOpacity
          key={source}
          style={[
            styles.button,
            selectedSource === source && styles.selectedButton
          ]}
          onPress={() => onSourceSelect(source)}
        >
          <Text style={[
            styles.buttonText,
            selectedSource === source && styles.selectedButtonText
          ]}>
            {source}
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

export default SourceFilter;