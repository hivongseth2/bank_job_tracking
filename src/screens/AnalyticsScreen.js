import React, { useState, useEffect,useContext } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles';
import { fetchTransactions } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/common/Card';
import ChipFilter from '../components/common/ChipFilter';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { ThemeContext } from '../context/ThemeContext';
import {calculateExpenseByCategory, calculateSpendingTrend,calculateIncomeVsExpense} from '../utils/transaction'
const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = ({ navigation }) => {


  const { colors } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('category'); // 'category', 'bank'
  const expenseByCategory = calculateExpenseByCategory(transactions);
  const spendingTrend = calculateSpendingTrend(transactions);
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
      const transactionDate = new Date(t.ngày_giao_dịch.split('/').reverse().join('-'));
      return transactionDate >= startDate;
    });
  };
  
  const getCategoryData = () => {
    if (!transactions.length) return [];
    
    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    
    // Chỉ lấy các giao dịch chi tiêu (số tiền âm)
    const expenses = filteredTransactions.filter(t => 
      parseFloat(formatCurrency(t.số_tiền)) < 0
    );
    
    // Nhóm theo loại giao dịch
    const categoryMap = {};
    expenses.forEach(transaction => {
      const category = transaction.loại_giao_dịch || 'Khác';
      const amount = Math.abs(parseFloat(formatCurrency(transaction.số_tiền)));
      
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += amount;
    });
    
    // Chuyển đổi thành mảng dữ liệu cho biểu đồ
    const chartColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#3F51B5'
    ];
    
    return Object.keys(categoryMap).map((category, index) => ({
      name: category,
      amount: categoryMap[category],
      color: chartColors[index % chartColors.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };
  
  const getBankData = () => {
    if (!transactions.length) return [];
    
    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    
    // Chỉ lấy các giao dịch chi tiêu (số tiền âm)
    const expenses = filteredTransactions.filter(t => 
      parseFloat(formatCurrency(t.số_tiền)) < 0
    );
    
    // Nhóm theo ngân hàng
    const bankMap = {};
    expenses.forEach(transaction => {
      const bank = transaction.nguồn_tiền || 'Khác';
      const amount = Math.abs(parseFloat(formatCurrency(transaction.số_tiền)));
      
      if (!bankMap[bank]) {
        bankMap[bank] = 0;
      }
      bankMap[bank] += amount;
    });
    
    // Chuyển đổi thành mảng dữ liệu cho biểu đồ
    const chartColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#3F51B5'
    ];
    
    return Object.keys(bankMap).map((bank, index) => ({
      name: bank,
      amount: bankMap[bank],
      color: chartColors[index % chartColors.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const getTopExpenses = () => {
    if (!transactions.length) return [];
    
    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    
    // Chỉ lấy các giao dịch chi tiêu (số tiền âm)
    const expenses = filteredTransactions.filter(t => 
      parseFloat(formatCurrency(t.số_tiền)) < 0
    );
    
    // Sắp xếp theo giá trị tuyệt đối (từ lớn đến nhỏ)
    const sortedExpenses = [...expenses].sort((a, b) => 
      Math.abs(parseFloat(formatCurrency(b.số_tiền))) - Math.abs(parseFloat(formatCurrency(a.số_tiền)))
    );
    
    // Lấy 5 giao dịch lớn nhất
    return sortedExpenses.slice(0, 5);
  };
  
  const getTotalExpense = () => {
    if (!transactions.length) return 0;
    
    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    
    // Tính tổng chi tiêu
    return filteredTransactions
      .filter(t => parseFloat(formatCurrency(t.số_tiền)) < 0)
      .reduce((sum, t) => sum + Math.abs(parseFloat(formatCurrency(t.số_tiền))), 0);
  };
  
  const getTotalIncome = () => {
    if (!transactions.length) return 0;
    
    const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);
    
    // Tính tổng thu nhập
    return filteredTransactions
      .filter(t => parseFloat(formatCurrency(t.số_tiền)) > 0)
      .reduce((sum, t) => sum + parseFloat(formatCurrency(t.số_tiền)), 0);
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

  const chartData = chartType === 'category' ? getCategoryData() : getBankData();
  const topExpenses = getTopExpenses();
  const totalExpense = getTotalExpense();
  const totalIncome = getTotalIncome();
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <SafeAreaView style={globalStyles.container}>

<ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Chi tiêu theo danh mục</Text>
        <PieChart
          data={expenseByCategory}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => colors.text,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Xu hướng chi tiêu</Text>
        {/* <LineChart
          data={spendingTrend}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.primary,
            labelColor: (opacity = 1) => colors.text,
          }}
          bezier
        /> */}
      </View>

      {/* Thêm các phân tích khác ở đây */}
    </ScrollView>
      <View style={globalStyles.glassHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={globalStyles.title}>Phân tích chi tiêu</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.filterRow}>
          <ChipFilter
            options={['week', 'month', 'year']}
            selectedOption={timeRange}
            onSelect={setTimeRange}
            containerStyle={{ paddingHorizontal: 0, paddingVertical: 8 }}
            textStyle={{ textTransform: 'capitalize' }}
          />
          
          <View style={styles.chartTypeContainer}>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === 'category' && styles.chartTypeButtonActive
              ]}
              onPress={() => setChartType('category')}
            >
              <Text 
                style={[
                  styles.chartTypeText,
                  chartType === 'category' && styles.chartTypeTextActive
                ]}
              >
                Loại
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === 'bank' && styles.chartTypeButtonActive
              ]}
              onPress={() => setChartType('bank')}
            >
              <Text 
                style={[
                  styles.chartTypeText,
                  chartType === 'bank' && styles.chartTypeTextActive
                ]}
              >
                Ngân hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Biểu đồ chi tiêu */}
        <Card>
          <Text style={styles.cardTitle}>
            {chartType === 'category' ? 'Chi tiêu theo loại' : 'Chi tiêu theo ngân hàng'}
          </Text>
          
          {chartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  backgroundColor: colors.white,
                  backgroundGradientFrom: colors.white,
                  backgroundGradientTo: colors.white,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Không có dữ liệu chi tiêu</Text>
            </View>
          )}
        </Card>
        
        {/* Tóm tắt tài chính */}
        <Card>
          <Text style={styles.cardTitle}>Tóm tắt tài chính</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng chi tiêu</Text>
              <Text style={styles.summaryValue}>
                {totalExpense.toLocaleString('vi-VN')} đ
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng thu nhập</Text>
              <Text style={styles.summaryValue}>
                {totalIncome.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tiết kiệm</Text>
              <Text style={styles.summaryValue}>
                {(totalIncome - totalExpense).toLocaleString('vi-VN')} đ
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tỷ lệ tiết kiệm</Text>
              <Text style={styles.summaryValue}>
                {savingsRate.toFixed(1)}%
              </Text>
            </View>
          </View>
        </Card>
        
        {/* Top chi tiêu */}
        <Card>
          <Text style={styles.cardTitle}>Top chi tiêu</Text>
          
          {topExpenses.length > 0 ? (
            topExpenses.map((expense, index) => (
              <View key={index} style={styles.expenseItem}>
                <View style={styles.expenseLeft}>
                  <Text style={styles.expenseRank}>{index + 1}</Text>
                  <View>
                    <Text style={styles.expenseDescription} numberOfLines={1}>
                      {expense.mô_tả}
                    </Text>
                    <Text style={styles.expenseDetails}>
                      {expense.ngày_giao_dịch} • {expense.nguồn_tiền}
                    </Text>
                  </View>
                </View>
                <Text style={styles.expenseAmount}>
                  {Math.abs(parseFloat(formatCurrency(expense.số_tiền))).toLocaleString('vi-VN')} đ
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Không có dữ liệu chi tiêu</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.text}10`,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartTypeContainer: {
    flexDirection: 'row',
    backgroundColor: `${colors.text}10`,
    borderRadius: 20,
    padding: 2,
  },
  chartTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  chartTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  chartTypeText: {
    fontSize: 14,
    color: colors.text,
  },
  chartTypeTextActive: {
    color: colors.white,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  noDataContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.primary}20`,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    width: screenWidth - 180,
  },
  expenseDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.danger,
  },
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default AnalyticsScreen;