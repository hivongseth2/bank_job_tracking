import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChipFilter from '../common/ChipFilter';
import { colors } from '../../styles';

const BankFilter = ({ banks, selectedBank, onSelectBank }) => {
  return (
    <View style={styles.container}>
      <ChipFilter
        options={banks}
        selectedOption={selectedBank}
        onSelect={onSelectBank}
        containerStyle={styles.filterContainer}
        chipStyle={styles.chip}
        selectedChipStyle={styles.selectedChip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  filterContainer: {
    paddingVertical: 10,
  },
  chip: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
});

export default BankFilter;