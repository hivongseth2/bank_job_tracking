import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ThemeContext } from '../../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const BalanceChart = ({ 
  transactions, 
  title = 'Biểu đồ số dư', 
  height = 220,
  width = screenWidth - 32,
  noDataMessage = 'Không đủ dữ liệu để hiển thị biểu đồ'
}) => {
  const { colors } = useContext(ThemeContext);

  const prepareChartData = () => {
    if (!transactions || transactions.length < 2) return null;

    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(a.ngày_giao_dịch.split('/').reverse().join('-')) - new Date(b.ngày_giao_dịch.split('/').reverse().join('-'));
    });

    const recentTransactions = sortedTransactions.slice(-6);
    const labels = recentTransactions.map(t => t.ngày_giao_dịch.split('/')[0]);
    const balances = recentTransactions.map(t => parseFloat(t.số_dư.replace(/[^\d.-]/g, '')));

    return {
      labels,
      datasets: [{ data: balances }]
    };
  };

  const chartData = prepareChartData();

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${colors.primary}, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  if (!chartData) {
    return (
      <View style={[styles.noDataContainer, { backgroundColor: `${colors.text}10` }]}>
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>{noDataMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <LineChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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

export default BalanceChart;