import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import TransactionList from '../components/transaction/TransactionList';
import BalanceChart from '../components/statistics/BalanceChart';
import SummaryCard from '../components/statistics/SummaryCard';
import BankSummary from '../components/statistics/BankSummary';
import { fetchTransactions, getBanks } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { colors, theme } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [banks, setBanks] = useState(['All']);
  const [selectedBank, setSelectedBank] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const transactionsData = await fetchTransactions();
      
      // Sắp xếp giao dịch theo thời gian, mới nhất lên đầu
      const sortedTransactions = [...transactionsData].sort((a, b) => {
        const dateA = a.ngày_giao_dịch ? new Date(a.ngày_giao_dịch.split('/').reverse().join('-')) : new Date(0);
        const dateB = b.ngày_giao_dịch ? new Date(b.ngày_giao_dịch.split('/').reverse().join('-')) : new Date(0);
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
      });
      
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
      
      const banksList = getBanks(sortedTransactions);
      setBanks(banksList);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleBankFilter = (bank) => {
    setSelectedBank(bank);
    if (bank === 'All') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(transaction => transaction.nguồn_tiền === bank)
      );
    }
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const calculateBalance = (transactions) => {
    if (!transactions || transactions.length === 0) return 0;
    
    // Lấy số dư từ giao dịch gần nhất (đã được sắp xếp)
    return parseFloat(transactions[0].số_dư || 0);
  };

  const calculateIncome = (transactions) => {
    if (!transactions || transactions.length === 0) return 0;
    
    return transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.số_tiền || 0);
      return amount > 0 ? sum + amount : sum;
    }, 0);
  };

  const calculateExpense = (transactions) => {
    if (!transactions || transactions.length === 0) return 0;
    
    return transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.số_tiền || 0);
      return amount < 0 ? sum + Math.abs(amount) : sum;
    }, 0);
  };

  if (loading && !refreshing) {
    return (
      <View style={[globalStyles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <View style={[globalStyles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Xin chào!</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleNotifications}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text style={styles.balanceAmount}>{calculateBalance(transactions).toLocaleString('vi-VN')} đ</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleAddTransaction}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Thêm giao dịch</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Budget')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Ngân sách</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Analytics')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="pie-chart-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Phân tích</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {error && (
          <Card>
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            <TouchableOpacity 
              style={[styles.setupButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Integrations')}
            >
              <Text style={styles.setupButtonText}>Thiết lập kết nối</Text>
            </TouchableOpacity>
          </Card>
        )}
        
        {/* Tổng quan */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tổng quan</Text>
        <View style={styles.summaryContainer}>
          <SummaryCard 
            title="Thu nhập"
            amount={calculateIncome(filteredTransactions)}
            icon="arrow-up-outline"
            color={colors.success}
          />
          <SummaryCard 
            title="Chi tiêu"
            amount={calculateExpense(filteredTransactions)}
            icon="arrow-down-outline"
            color={colors.danger}
          />
        </View>
        
        {/* Tính năng mới - Thiết kế đẹp hơn */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tính năng mới</Text>
        <View style={styles.featuresContainer}>
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: theme === 'dark' ? colors.glass : '#f8f9fa', borderColor: colors.glassBorder }]}
            onPress={() => navigation.navigate('Jobs')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: `${colors.primary}10` }]}>
              <Ionicons name="briefcase-outline" size={28} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Theo dõi công việc</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Quản lý các công việc đã apply
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: theme === 'dark' ? colors.glass : '#f8f9fa', borderColor: colors.glassBorder }]}
            onPress={() => navigation.navigate('AIChat')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: `${colors.primary}10` }]}>
              <Ionicons name="chatbubbles-outline" size={28} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Chat với AI</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Thảo luận với nhiều AI cùng lúc
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {/* Biểu đồ */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Biến động số dư</Text>
          <BalanceChart transactions={filteredTransactions} />
        </Card>
        
        {/* Tổng quan theo ngân hàng */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Tổng quan theo ngân hàng</Text>
          <BankSummary transactions={transactions} />
        </Card>
        
        {/* Giao dịch gần đây */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Giao dịch gần đây</Text>
        <Card style={styles.transactionsCard}>
          <TransactionList 
            transactions={filteredTransactions.slice(0, 5)} 
            banks={banks}
            selectedBank={selectedBank}
            onBankSelect={handleBankFilter}
          />
          
          <TouchableOpacity 
            style={[styles.viewAllButton, { borderTopColor: `${colors.text}10` }]}
            onPress={() => navigation.navigate('Statistics')}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>Xem tất cả giao dịch</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddTransaction}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: -30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  setupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  setupButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
  },
});

export default HomeScreen;