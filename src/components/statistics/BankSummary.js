import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '../../styles';
import Card from '../common/Card';

const BankSummary = ({ banks, title = 'Số dư theo ngân hàng' }) => {
  const renderBankItem = ({ item }) => {
    return (
      <View style={styles.bankItem}>
        <Text style={styles.bankName}>{item.name}</Text>
        <Text style={styles.bankBalance}>
          {item.balance.toLocaleString('vi-VN')} đ
        </Text>
      </View>
    );
  };

  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      
      <FlatList
        data={banks}
        renderItem={renderBankItem}
        keyExtractor={(item) => item.name}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu ngân hàng</Text>
          </View>
        }
      />
      
      {banks?.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng số dư</Text>
          <Text style={styles.totalValue}>
            {banks.reduce((sum, bank) => sum + bank.balance, 0).toLocaleString('vi-VN')} đ
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  bankBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default BankSummary;