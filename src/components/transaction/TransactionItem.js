import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import Card from '../common/Card';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';

const TransactionItem = ({ transaction, onPress }) => {
  const { colors } = useContext(ThemeContext);
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
      <Card style={[styles.container, { backgroundColor: colors.card }]}> 
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
            <Ionicons name={getIconName()} size={24} color={getIconColor()} />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.topRow}>
              <Text style={[styles.description, { color: colors.text }]} numberOfLines={1}>
                {transaction.mô_tả}
              </Text>
              <Text 
                style={[
                  styles.amount, 
                  { color: isPositive ? colors.success : colors.danger }
                ]}
              >
                {isPositive ? '+' : ''}{amount.toLocaleString('vi-VN')} đ
              </Text>
            </View>
            
            <View style={styles.bottomRow}>
              <View style={styles.detailsContainer}>
                <Text style={[styles.bank, { color: colors.primary }]}>{transaction.nguồn_tiền}</Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{formatTimeAgo(transaction.ngày_giao_dịch)}</Text>
              </View>
              <Text style={[styles.balance, { color: colors.textSecondary }]}>
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
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bank: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
  },
  balance: {
    fontSize: 12,
  },
});

export default TransactionItem;