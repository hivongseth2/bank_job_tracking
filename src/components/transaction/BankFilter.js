import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import ChipFilter from '../common/ChipFilter';

const BankFilter = ({ banks, selectedBank, onBankSelect }) => {
  const { colors } = useContext(ThemeContext);
  
  // Đảm bảo luôn có option "All"
  const allBanks = ['All', ...new Set(banks.filter(bank => bank !== 'All'))];

  console.log('allBanks', allBanks);
  
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

          <ChipFilter

          options={banks}
          selectedOption={selectedBank}
          onSelect={onBankSelect}
          containerStyle={{ paddingHorizontal: 0, paddingVertical: 8 }}
          textStyle={{ textTransform: 'capitalize' }}
      
          />

        {/* {allBanks.map((bank) => (
          <ChipFilter

          options={['week', 'month', 'year']}

            key={bank}
            label={bank === 'All' ? 'Tất cả' : bank}
            selected={selectedBank === bank}
            onPress={() => onBankSelect(bank)}
          />
        ))} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
 
});

export default BankFilter;