import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { fetchTransactions, fetchBudgets } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {styles} from  '../styles/budgetStyle'
// Ánh xạ loại giao dịch sang danh mục ngân sách
const CATEGORY_MAPPING = {
  'Ăn uống': ['Ăn uống', 'Cafe', 'Nhà hàng'],
  'Di chuyển': ['Di chuyển', 'Xăng', 'Taxi', 'Grab', 'Gojek'],
  'Mua sắm': ['Mua sắm', 'Quần áo', 'Giày dép', 'Mỹ phẩm'],
  'Giải trí': ['Giải trí', 'Phim ảnh', 'Game', 'Du lịch'],
  'Hóa đơn': ['Hóa đơn', 'Điện', 'Nước', 'Internet', 'Điện thoại', 'Thuê nhà'],
  'Nhà cửa': ['Nhà cửa', 'Sửa chữa', 'Nội thất', 'Đồ gia dụng'],
  'Sức khỏe': ['Sức khỏe', 'Thuốc', 'Bác sĩ', 'Bảo hiểm'],
  'Giáo dục': ['Giáo dục', 'Học phí', 'Sách vở', 'Khóa học'],
  'Quà tặng': ['Quà tặng', 'Từ thiện', 'Biếu tặng'],
};

const BudgetScreen = ({ navigation, route }) => {
  const { colors } = useContext(ThemeContext);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Tải dữ liệu giao dịch
      const transactionsData = await fetchTransactions();
      setTransactions(transactionsData);
      
      // Tải dữ liệu ngân sách
      let budgetsData = await fetchBudgets();
      
      // Chuyển đổi dữ liệu từ API sang định dạng phù hợp
      if (budgetsData && budgetsData.length > 0) {
        budgetsData = budgetsData.map((budget, index) => ({
          id: index,
          category: budget.danh_mục || 'Khác',
          limit: parseFloat(budget.hạn_mức || 0),
          spent: parseFloat(budget.đã_chi || 0),
          icon: budget.icon || getBudgetIcon(budget.danh_mục),
          color: getBudgetColor(index),
          rawData: budget
        }));
        
        // Cập nhật chi tiêu thực tế dựa trên giao dịch
        const updatedBudgets = updateBudgetSpending(budgetsData, transactionsData);
        setBudgets(updatedBudgets);
      } else {
        setBudgets([]);
      }
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
      if (route.params?.refresh) {
        loadData();
        // Reset the parameter to avoid unnecessary refreshes
        navigation.setParams({ refresh: false });
      }
    }, [route.params?.refresh])
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  const getBudgetIcon = (category) => {
    switch (category) {
      case 'Ăn uống': return 'restaurant-outline';
      case 'Di chuyển': return 'car-outline';
      case 'Mua sắm': return 'cart-outline';
      case 'Giải trí': return 'film-outline';
      case 'Hóa đơn': return 'receipt-outline';
      case 'Nhà cửa': return 'home-outline';
      case 'Sức khỏe': return 'medkit-outline';
      case 'Giáo dục': return 'school-outline';
      case 'Quà tặng': return 'gift-outline';
      default: return 'wallet-outline';
    }
  };
  
  const getBudgetColor = (index) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00CC99', '#FF6666', '#99CCFF', '#FFCC99'];
    return colors[index % colors.length];
  };
  
  const updateBudgetSpending = (budgetsData, transactionsData) => {
    // Lọc giao dịch trong tháng hiện tại
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthTransactions = transactionsData.filter(t => {
      if (!t.ngày_giao_dịch) return false;
      
      const parts = t.ngày_giao_dịch.split('/');
      if (parts.length !== 3) return false;
      
      const transactionMonth = parseInt(parts[1]) - 1; // Tháng trong JS bắt đầu từ 0
      const transactionYear = parseInt(parts[2]);
      return transactionMonth === currentMonth && transactionYear === currentYear;
    });
    
    // Cập nhật chi tiêu cho từng danh mục
    const updatedBudgets = [...budgetsData];
    
    updatedBudgets.forEach(budget => {
      let categorySpent = 0;
      
      thisMonthTransactions.forEach(transaction => {
        const amount = parseFloat(transaction.số_tiền || 0);
        if (amount < 0) { // Chỉ tính chi tiêu (số tiền âm)
          // Kiểm tra xem giao dịch có thuộc danh mục này không
          const description = transaction.mô_tả ? transaction.mô_tả.toLowerCase() : '';
          const transactionType = transaction.loại_giao_dịch || '';
          
          // Kiểm tra theo loại giao dịch và mô tả
          const matchesCategory = 
            (CATEGORY_MAPPING[budget.category] && 
             (CATEGORY_MAPPING[budget.category].includes(transactionType) ||
              CATEGORY_MAPPING[budget.category].some(keyword => 
                description.includes(keyword.toLowerCase())
              )));
          
          if (matchesCategory) {
            categorySpent += Math.abs(amount);
          }
        }
      });
      
      // Cập nhật chi tiêu thực tế
      budget.spent = categorySpent;
    });
    
    return updatedBudgets;
  };
  
  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + budget.limit, 0);
  };
  
  const getTotalSpent = () => {
    return budgets.reduce((sum, budget) => sum + budget.spent, 0);
  };
  
  const getPercentage = (spent, limit) => {
    return limit > 0 ? (spent / limit) * 100 : 0;
  };
  
  const handleAddBudget = () => {
    navigation.navigate('AddBudget');
  };
  
  const handleEditBudget = (budget) => {
    navigation.navigate('EditBudget', {
      budget: {
        danh_mục: budget.category,
        hạn_mức: budget.limit.toString(),
        đã_chi: budget.spent.toString(),
        icon: budget.icon
      },
      index: budget.id
    });
  };
  
  const renderBudgetItem = (budget) => {
    const percentage = getPercentage(budget.spent, budget.limit);
    let statusColor = colors.success;
    
    if (percentage >= 90) {
      statusColor = colors.danger;
    } else if (percentage >= 70) {
      statusColor = colors.warning;
    }
    
    return (
      <TouchableOpacity 
        key={budget.id} 
        style={styles.budgetItem}
        onPress={() => handleEditBudget(budget)}
        activeOpacity={0.8}
      >
        <View style={styles.budgetHeader}>
          <View style={styles.budgetCategory}>
            <View style={[styles.categoryIcon, { backgroundColor: `${budget.color}20` }]}>
              <Ionicons name={budget.icon} size={20} color={budget.color} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>{budget.category}</Text>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
        
        <View style={styles.budgetDetails}>
          <View style={[styles.budgetProgress, { backgroundColor: `${colors.text}10` }]}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${Math.min(percentage, 100)}%`, backgroundColor: statusColor }
              ]} 
            />
          </View>
          
          <View style={styles.budgetValues}>
            <Text style={[styles.spentValue, { color: colors.text }]}>
              {budget.spent.toLocaleString('vi-VN')} đ
            </Text>
            <Text style={[styles.limitValue, { color: colors.textSecondary }]}>
              / {budget.limit.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          
          <Text style={[styles.percentageText, { color: statusColor }]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[globalStyles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải dữ liệu ngân sách...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <View style={[globalStyles.glassHeader, { backgroundColor: colors.glass }]}>
        <Text style={[globalStyles.title, { color: colors.text }]}>Ngân sách</Text>
        <Text style={[globalStyles.subtitle, { color: colors.textSecondary }]}>
          Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
        </Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={{ padding: 16 }}
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
            <Button 
              title="Thử lại" 
              onPress={loadData}
              style={styles.retryButton}
            />
          </Card>
        )}
        
        {/* Tóm tắt ngân sách */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Tổng quan ngân sách</Text>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryProgress}>
              <View style={[
                styles.progressCircle, 
                { borderColor: `${colors.primary}30` }
              ]}>
                <Text style={[styles.progressText, { color: colors.primary }]}>
                  {getPercentage(getTotalSpent(), getTotalBudget()).toFixed(0)}%
                </Text>
              </View>
            </View>
            
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Đã chi tiêu</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {getTotalSpent().toLocaleString('vi-VN')} đ
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Ngân sách</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {getTotalBudget().toLocaleString('vi-VN')} đ
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Còn lại</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {(getTotalBudget() - getTotalSpent()).toLocaleString('vi-VN')} đ
                </Text>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Danh sách ngân sách */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ngân sách theo danh mục</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: `${colors.primary}20` }]}
            onPress={handleAddBudget}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Card style={styles.budgetListCard}>
          {budgets.length > 0 ? (
            budgets.map(renderBudgetItem)
          ) : (
            <View style={styles.emptyBudget}>
              <Ionicons name="wallet-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyBudgetText, { color: colors.text }]}>
                Chưa có ngân sách nào
              </Text>
              <Text style={[styles.emptyBudgetSubtext, { color: colors.textSecondary }]}>
                Hãy thêm ngân sách đầu tiên của bạn
              </Text>
              <Button 
                title="Thêm ngân sách mới" 
                onPress={handleAddBudget}
                style={styles.emptyBudgetButton}
              />
            </View>
          )}
          
          {budgets.length > 0 && (
            <TouchableOpacity 
              style={styles.addBudgetButton}
              onPress={handleAddBudget}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.addBudgetText, { color: colors.primary }]}>Thêm ngân sách mới</Text>
            </TouchableOpacity>
          )}
        </Card>
        
        {/* Nút chuyển đến mục tiêu tài chính */}
        <TouchableOpacity 
          style={[
            styles.goalsButton, 
            { 
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder
            }
          ]}
          onPress={() => navigation.navigate('Goals')}
        >
          <View style={styles.goalsButtonContent}>
            <Ionicons name="flag-outline" size={24} color={colors.primary} />
            <View style={styles.goalsButtonText}>
              <Text style={[styles.goalsButtonTitle, { color: colors.text }]}>Mục tiêu tài chính</Text>
              <Text style={[styles.goalsButtonSubtitle, { color: colors.textSecondary }]}>
                Thiết lập và theo dõi các mục tiêu tài chính của bạn
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BudgetScreen;