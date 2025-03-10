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
import { fetchGoals } from '../services/api';

const GoalsScreen = ({ navigation, route }) => {
  const { colors } = useContext(ThemeContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Tải dữ liệu mục tiêu tài chính
      let goalsData = await fetchGoals();
      
      // Chuyển đổi dữ liệu từ API sang định dạng phù hợp
      if (goalsData && goalsData.length > 0) {
        goalsData = goalsData.map((goal, index) => ({
          id: index,
          name: goal.tên_mục_tiêu || 'Mục tiêu không tên',
          targetAmount: parseFloat(goal.số_tiền_mục_tiêu || 0),
          currentAmount: parseFloat(goal.số_tiền_hiện_tại || 0),
          startDate: goal.ngày_bắt_đầu || '',
          endDate: goal.ngày_kết_thúc || '',
          color: getGoalColor(index),
          rawData: goal
        }));
        
        setGoals(goalsData);
      } else {
        setGoals([]);
      }
    } catch (err) {
      console.error('Error loading goals:', err);
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
  
  const getGoalColor = (index) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00CC99', '#FF6666', '#99CCFF', '#FFCC99'];
    return colors[index % colors.length];
  };
  
  const getPercentage = (current, target) => {
    return target > 0 ? (current / target) * 100 : 0;
  };
  
  const getDaysLeft = (endDateStr) => {
    if (!endDateStr) return 0;
    
    const parts = endDateStr.split('/');
    if (parts.length !== 3) return 0;
    
    const endDate = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const handleAddGoal = () => {
    navigation.navigate('AddGoal');
  };
  
  const handleEditGoal = (goal) => {
    navigation.navigate('EditGoal', {
      goal: goal.rawData,
      index: goal.id
    });
  };
  
  const renderGoalItem = (goal) => {
    const percentage = getPercentage(goal.currentAmount, goal.targetAmount);
    const daysLeft = getDaysLeft(goal.endDate);
    
    return (
      <TouchableOpacity 
        key={goal.id} 
        style={styles.goalItem}
        onPress={() => handleEditGoal(goal)}
        activeOpacity={0.8}
      >
        <View style={styles.goalHeader}>
          <Text style={[styles.goalName, { color: colors.text }]}>{goal.name}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
        
        <View style={styles.goalDetails}>
          <View style={[styles.goalProgress, { backgroundColor: `${colors.text}10` }]}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${Math.min(percentage, 100)}%`, backgroundColor: goal.color }
              ]} 
            />
          </View>
          
          <View style={styles.goalValues}>
            <Text style={[styles.currentValue, { color: colors.text }]}>
              {goal.currentAmount.toLocaleString('vi-VN')} đ
            </Text>
            <Text style={[styles.targetValue, { color: colors.textSecondary }]}>
              / {goal.targetAmount.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          
          <Text style={[styles.percentageText, { color: goal.color }]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
        
        <View style={styles.goalFooter}>
          <View style={styles.dateInfo}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Bắt đầu:</Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>{goal.startDate}</Text>
          </View>
          
          <View style={styles.dateInfo}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Kết thúc:</Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>{goal.endDate}</Text>
          </View>
          
          <View style={[styles.daysLeft, { backgroundColor: `${goal.color}20` }]}>
            <Text style={[styles.daysLeftText, { color: goal.color }]}>
              {daysLeft} ngày
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[globalStyles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải dữ liệu mục tiêu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <View style={[globalStyles.glassHeader, { backgroundColor: colors.glass }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: `${colors.text}10` }]}
            onPress={() => navigation.navigate('BudgetMain')}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[globalStyles.title, { color: colors.text }]}>Mục tiêu tài chính</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: `${colors.primary}20` }]}
            onPress={handleAddGoal}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
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
        
        {/* Danh sách mục tiêu */}
        <Card style={styles.goalListCard}>
          {goals.length > 0 ? (
            goals.map(renderGoalItem)
          ) : (
            <View style={styles.emptyGoal}>
              <Ionicons name="flag-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyGoalText, { color: colors.text }]}>
                Chưa có mục tiêu nào
              </Text>
              <Text style={[styles.emptyGoalSubtext, { color: colors.textSecondary }]}>
                Hãy thêm mục tiêu tài chính đầu tiên của bạn
              </Text>
              <Button 
                title="Thêm mục tiêu mới" 
                onPress={handleAddGoal}
                style={styles.emptyGoalButton}
              />
            </View>
          )}
          
          {goals.length > 0 && (
            <TouchableOpacity 
              style={styles.addGoalButton}
              onPress={handleAddGoal}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.addGoalText, { color: colors.primary }]}>Thêm mục tiêu mới</Text>
            </TouchableOpacity>
          )}
        </Card>
        
        {/* Mẹo tiết kiệm */}
        <Card style={styles.tipsCard}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Mẹo tiết kiệm</Text>
          
          <View style={styles.tipItem}>
            <View style={[styles.tipIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Thiết lập tiết kiệm tự động hàng tháng để đạt mục tiêu nhanh hơn
              </Text>
            </View>
          </View>
          
          <View style={styles.tipItem}>
            <View style={[styles.tipIcon, { backgroundColor: `${colors.success}20` }]}>
              <Ionicons name="trending-up-outline" size={20} color={colors.success} />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Đầu tư một phần tiền tiết kiệm để tăng lợi nhuận dài hạn
              </Text>
            </View>
          </View>
          
          <View style={styles.tipItem}>
            <View style={[styles.tipIcon, { backgroundColor: `${colors.warning}20` }]}>
              <Ionicons name="wallet-outline" size={20} color={colors.warning} />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Cắt giảm chi tiêu không cần thiết và chuyển số tiền đó vào mục tiêu của bạn
              </Text>
            </View>
          </View>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalListCard: {
    padding: 0,
    overflow: 'hidden',
  },
  goalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalDetails: {
    marginBottom: 12,
  },
  goalProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  goalValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  targetValue: {
    fontSize: 14,
  },
  percentageText: {
    position: 'absolute',
    right: 0,
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateInfo: {
    flexDirection: 'column',
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  daysLeft: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  daysLeftText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addGoalText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  tipsCard: {
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  emptyGoal: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyGoalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyGoalSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyGoalButton: {
    minWidth: 200,
  },
});

export default GoalsScreen;