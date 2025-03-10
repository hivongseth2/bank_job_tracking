import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles';
import Card from '../common/Card';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';

const TransactionItem = ({ transaction, onPress }) => {
  const amount = parseFloat(formatCurrency(transaction.số_tiền));
  const isPositive = amount >= 0;
  
  const getIconName = () => {
    if (transaction.loại_giao_dịch === 'Chuyển tiền') {
      return isPositive ? 'arrow-down-circle' : 'arrow-up-circle';
    } else if (transaction.loại_giao_dịch === 'Thanh toán') {
      return 'card-outline';
    } else if (transaction.loại_giao_dịch === 'Rút tiền') {
      return 'cash-outline';
    } else if (transaction.loại_giao_dịch === 'Nạp tiền') {
      return 'wallet-outline';
    }
    return 'swap-horizontal';
  };
  
  const getIconColor = () => {
    return isPositive ? colors.success : colors.danger;
  };
  
  const getIconBackground = () => {
    return isPositive ? `${colors.success}15` : `${colors.danger}15`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
            <Ionicons name={getIconName()} size={24} color={getIconColor()} />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.topRow}>
              <Text style={styles.description} numberOfLines={1}>
                {transaction.mô_tả}
              </Text>
              <Text 
                style={[
                  styles.amount, 
                  isPositive ? styles.positiveAmount : styles.negativeAmount
                ]}
              >
                {isPositive ? '+' : ''}{amount.toLocaleString('vi-VN')} đ
              </Text>
            </View>
            
            <View style={styles.bottomRow}>
              <View style={styles.detailsContainer}>
                <Text style={styles.bank}>{transaction.nguồn_tiền}</Text>
                <Text style={styles.date}>{formatTimeAgo(transaction.ngày_giao_dịch)}</Text>
              </View>
              <Text style={styles.balance}>
                Số dư: {parseFloat(formatCurrency(transaction.số_dư)).toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.danger,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bank: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  balance: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default TransactionItem;