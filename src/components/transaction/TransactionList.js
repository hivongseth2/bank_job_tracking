import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import TransactionItem from './TransactionItem';
import BankFilter from './BankFilter';
import EmptyState from '../common/EmptyState';

const TransactionList = ({ 
  transactions, 
  banks, 
  selectedBank, 
  onBankSelect, 
  onTransactionPress,
  showFilter = true
}) => {
  const { colors } = useContext(ThemeContext);


  

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState 
        icon="wallet-outline"
        title="Không có giao dịch nào"
        message="Chưa có giao dịch nào được thêm vào. Hãy thêm giao dịch đầu tiên của bạn."
      />
    );
  }

  return (
    <View style={[styles.container,{    backgroundColor:colors.glasst
    }]}>
      {showFilter && (
        <BankFilter 
          banks={banks} 
          selectedBank={selectedBank} 
          onBankSelect={onBankSelect} 
        />
      )}
      
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => `transaction-${index}`}
        renderItem={({ item, index }) => (
          <TransactionItem 
            transaction={item} 
            onPress={() => onTransactionPress && onTransactionPress(item, index)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:3,
  },
  listContent: {
    paddingBottom: 8,
  },
});

export default TransactionList;