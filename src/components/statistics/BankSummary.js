import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ThemeContext } from '../../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const BankSummary = ({ transactions }) => {
  const { colors } = useContext(ThemeContext);
  const defaultColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const prepareBankData = () => {
    if (!transactions || transactions.length === 0) return null;
  
    const bankMap = {};
    transactions.forEach(transaction => {
      const bank = transaction.nguồn_tiền;
      if (!bankMap[bank]) {
        bankMap[bank] = 0;
      }
      bankMap[bank] += parseFloat(transaction.số_tiền.replace(/[^\d.-]/g, ''));
    });
  
    return Object.entries(bankMap).map(([name, balance], index) => ({
      name,
      balance: Math.abs(balance),
      color: (colors.chartColors && colors.chartColors[index % colors.chartColors.length]) || defaultColors[index % defaultColors.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const chartData = prepareBankData();

  if (!chartData) {
    return (
      <View style={[styles.noDataContainer, { backgroundColor: `${colors.text}10` }]}>
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>Không có dữ liệu ngân hàng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Tổng quan theo ngân hàng</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => colors.text,
        }}
        accessor="balance"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
  },
});

export default BankSummary;