import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles';
import Card from '../common/Card';

const CurrentBalanceCard = ({ balances }) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>💰 Số dư tài khoản</Text>
      {Object.entries(balances).map(([nguonTien, soDu]) => (
        <View key={nguonTien} style={styles.balanceRow}>
          <View style={styles.bankInfo}>
            <MaterialIcons name="account-balance-wallet" size={20} color={colors.textPrimary} />
            <Text style={styles.label}>{nguonTien}</Text>
          </View>
          <Text style={styles.balance}>{soDu}</Text>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#fff',
   
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
});

export default CurrentBalanceCard;
