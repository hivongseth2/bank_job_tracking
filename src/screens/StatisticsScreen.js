import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../styles';
import { fetchTransactions } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import BalanceChart from '../components/statistics/BalanceChart';
import SummaryCard from '../components/statistics/SummaryCard';
import BankSummary from '../components/statistics/BankSummary';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import ChipFilter from '../components/common/ChipFilter';
import { Ionicons } from '@expo/vector-icons';

const StatisticsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getChartData = () => {
    if (!transactions.length) return { labels: [], datasets: [{ data: [] }] };

    // Lọc giao dịch theo khoảng thời gian
    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);

    // Sắp xếp giao dịch theo ngày
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return formatDate(a.ngày_giao_dịch) - formatDate(b.ngày_giao_dịch);
    });

    // Lấy 6 giao dịch gần nhất để hiển thị trên biểu đồ
    const recentTransactions = sortedTransactions.slice(-6);
    
    return {
      labels: recentTransactions.map(t => t.ngày_giao_dịch),
      datasets: [
        {
          data: recentTransactions.map(t => 
            parseFloat(formatCurrency(t.số_dư))
          ),
        },
      ],
    };
  };

  const filterTransactionsByTimeRange = (transactions, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Từ đầu thời gian
    }

    return transactions.filter(t => {
      const transactionDate = formatDate(t.ngày_giao_dịch);
      return transactionDate >= startDate;
    });
  };

  const getBankSummaryData = () => {
    if (!transactions.length) return [];

    const bankMap = {};
    
    transactions.forEach(transaction => {
      const bank = transaction.nguồn_tiền;
      if (!bankMap[bank]) {
        // Lấy giao dịch mới nhất của mỗi ngân hàng để hiển thị số dư
        const latestTransaction = [...transactions]
          .filter(t => t.nguồn_tiền === bank)
          .sort((a, b) => formatDate(b.ngày_giao_dịch) - formatDate(a.ngày_giao_dịch))[0];
        
        bankMap[bank] = {
          name: bank,
          balance: parseFloat(formatCurrency(latestTransaction.số_dư))
        };
      }
    });
    
    return Object.values(bankMap);
  };

  if (loading) {
    return <Loading message="Đang tải dữ liệu..." />;
  }

  if (error) {
    return (
      <View style={globalStyles.centered}>
        <Text style={{ fontSize: 16, color: colors.danger, textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <Button title="Thử lại" onPress={loadData} />
      </View>
    );
  }

  const chartData = getChartData();
  const bankSummaryData = getBankSummaryData();

  // Tính tổng thu nhập và chi tiêu
  const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
  const income = filteredTransactions
    .filter(t => parseFloat(formatCurrency(t.số_tiền)) > 0)
    .reduce((sum, t) => sum + parseFloat(formatCurrency(t.số_tiền)), 0);
  
  const expense = filteredTransactions
    .filter(t => parseFloat(formatCurrency(t.số_tiền)) < 0)
    .reduce((sum, t) => sum + parseFloat(formatCurrency(t.số_tiền)), 0);

  const balance = income + expense;

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.glassHeader}>
        <Text style={globalStyles.title}>Thống kê tài chính</Text>
        <ChipFilter
          options={['week', 'month', 'year']}
          selectedOption={timeRange}
          onSelect={setTimeRange}
          containerStyle={{ paddingHorizontal: 0, paddingVertical: 8 }}
          textStyle={{ textTransform: 'capitalize' }}
          scrollable={false}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <BalanceChart data={chartData} />
        
        <SummaryCard 
          income={income} 
          expense={Math.abs(expense)} 
          balance={balance} 
        />
        
        <BankSummary banks={bankSummaryData} />
        
        <TouchableOpacity 
          style={styles.analyticsButton}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Ionicons name="pie-chart-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.analyticsButtonText}>Xem phân tích chi tiết</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 24,
  },
  analyticsButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatisticsScreen;