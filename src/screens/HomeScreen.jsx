import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import TransactionList from '../components/transaction/TransactionList';
import BalanceChart from '../components/statistics/BalanceChart';
import BankSummary from '../components/statistics/BankSummary';
import { fetchTransactions, getBanks } from '../services/api';
import { QUICK_ACTIONS } from '../config/quickActionsConfig';

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [banks, setBanks] = useState(['All']);
  const [selectedBank, setSelectedBank] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 380; // Maximum header height
  const HEADER_MIN_HEIGHT = 120; // Minimum header height when scrolled

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const contentOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderQuickAction = ({ id, icon, label, navigateTo }) => (
    <TouchableOpacity
      key={id}
      style={styles.actionButton}
      onPress={() => navigation.navigate(navigateTo)}
    >
      <View style={[styles.actionIcon, { backgroundColor: colors.glass }]}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={[styles.actionText, { color: colors.light }]}>{label}</Text>
    </TouchableOpacity>
  );
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

      console.log(sortedTransactions, 'sortedTransactions');

      setFilteredTransactions(sortedTransactions);

      // Lấy danh sách ngân hàng duy nhất
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
  const handleViewAllTransactions = () => {
    setShowAllTransactions(true);
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

  // Lấy tên người dùng
  const getUserName = () => {
    const hours = new Date().getHours();
    let greeting = '';

    if (hours < 12) {
      greeting = 'Chào buổi sáng';
    } else if (hours < 18) {
      greeting = 'Chào buổi chiều';
    } else {
      greeting = 'Chào buổi tối';
    }

    return `${greeting}, Người dùng!`;
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
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
            height: headerHeight,
          }
        ]}
      >
        {/* Balance info stays at the top */}
        <View style={styles.flexContainer}>
          
        <View style={styles.balanceContainer}>

          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text style={styles.balanceAmount}>
            {calculateBalance(transactions).toLocaleString('vi-VN')} đ
          </Text>
          <View style={styles.balanceSummary}>
            <View style={styles.balanceItem}>
              <Ionicons name="arrow-up-circle" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.balanceItemText}>
                {calculateIncome(transactions).toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Ionicons name="arrow-down-circle" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.balanceItemText}>
                {calculateExpense(transactions).toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
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

        {/* Other content fades out */}
        <Animated.View style={[styles.headerContent, { opacity: contentOpacity }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getUserName()}</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
        
          </View>

          <View style={[styles.quickActions, { backgroundColor: colors.glassBorder }]}>
            {QUICK_ACTIONS.map(renderQuickAction)}
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
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

        <View style={styles.overviewContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tổng quan</Text>
          <View style={styles.overviewCards}>
            <Card style={[styles.overviewCard, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="arrow-up-circle" size={24} color={colors.success} />
              <Text style={[styles.overviewAmount, { color: colors.text }]}>
                {calculateIncome(filteredTransactions).toLocaleString('vi-VN')} đ
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Thu nhập</Text>
            </Card>
            <Card style={[styles.overviewCard, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="arrow-down-circle" size={24} color={colors.danger} />
              <Text style={[styles.overviewAmount, { color: colors.text }]}>
                {calculateExpense(filteredTransactions).toLocaleString('vi-VN')} đ
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Chi tiêu</Text>
            </Card>
          </View>
        </View>
        {/* Tính năng mới - Thiết kế đẹp hơn */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tính năng mới</Text>
        <View style={styles.featuresContainer}>
          <TouchableOpacity
            style={[
              styles.featureCard,
              {
                backgroundColor: isDarkMode ? colors.card : colors.background,
                borderColor: colors.border
              }
            ]}
            onPress={() => navigation.navigate('Jobs')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: `${colors.primary}20` }]}>
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
            style={[
              styles.featureCard,
              {
                backgroundColor: isDarkMode ? colors.card : colors.background,
                borderColor: colors.border
              }
            ]}
            onPress={() => navigation.navigate('AIChat')}
          >
            <View style={[styles.featureIconContainer, { backgroundColor: `${colors.primary}20` }]}>
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
            transactions={showAllTransactions ? filteredTransactions : filteredTransactions.slice(0, 5)}
            banks={banks}
            selectedBank={selectedBank}
            onBankSelect={handleBankFilter}
            showFilter={true}
          />

          {!showAllTransactions && (
            <TouchableOpacity
              style={[styles.viewAllButton, { borderTopColor: `${colors.text}10` }]}
              onPress={handleViewAllTransactions}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>Xem tất cả giao dịch</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </Card>
      </Animated.ScrollView>
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  balanceContainer: {
    // paddingTop: 2,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 24, // Reduced size to fit better when collapsed
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceSummary: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  balanceItemText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12, // Reduced size to fit better when collapsed
    marginLeft: 4,
  },
  headerContent: {
    marginTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
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

  overviewContainer: {
    marginBottom: 24,
  },
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
  },
  overviewAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  overviewLabel: {
    fontSize: 14,
  },

  flexContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default HomeScreen;