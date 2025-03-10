import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles';
import Card from '../common/Card';

const SummaryCard = ({ income, expense, balance }) => {
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng thu</Text>
          <Text style={[styles.summaryValue, styles.positiveAmount]}>
            {income?.toLocaleString('vi-VN')} đ
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tổng chi</Text>
          <Text style={[styles.summaryValue, styles.negativeAmount]}>
            {expense?.toLocaleString('vi-VN')} đ
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Chênh lệch</Text>
          <Text style={[
            styles.summaryValue, 
            balance >= 0 ? styles.positiveAmount : styles.negativeAmount
          ]}>
            {balance?.toLocaleString('vi-VN')} đ
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.danger,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
});

export default SummaryCard;