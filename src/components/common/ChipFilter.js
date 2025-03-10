import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

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
  const { colors } = useContext(ThemeContext);

  const renderChips = () => {
    return options?.map((option, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.chip,
          { backgroundColor: colors.glass },
          selectedOption === option && { backgroundColor: colors.primary },
          chipStyle,
          selectedOption === option && selectedChipStyle,
        ]}
        onPress={() => onSelect(option)}
      >
        <Text
          style={[
            styles.chipText,
            { color: colors.text },
            selectedOption === option && { color: colors.white },
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
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
  },
});

export default ChipFilter;
