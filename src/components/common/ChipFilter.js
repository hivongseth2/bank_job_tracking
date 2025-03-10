import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../styles';

const ChipFilter = ({ 
  options, 
  selectedOption, 
  onSelect, 
  containerStyle, 
  chipStyle, 
  textStyle,
  selectedChipStyle,
  selectedTextStyle,
  scrollable = true
}) => {
  const renderChips = () => {
    return options.map((option, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.chip,
          selectedOption === option && styles.chipSelected,
          chipStyle,
          selectedOption === option && selectedChipStyle,
        ]}
        onPress={() => onSelect(option)}
      >
        <Text
          style={[
            styles.chipText,
            selectedOption === option && styles.chipTextSelected,
            textStyle,
            selectedOption === option && selectedTextStyle,
          ]}
        >
          {option}
        </Text>
      </TouchableOpacity>
    ));
  };

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, containerStyle]}
      >
        {renderChips()}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {renderChips()}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
    fontWeight: '500',
  },
});

export default ChipFilter;