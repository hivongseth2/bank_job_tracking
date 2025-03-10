import React, { useState, useContext } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { updateGoal, deleteGoal } from '../services/api';

const EditGoalScreen = ({ navigation, route }) => {
  const { colors } = useContext(ThemeContext);
  const { goal, index } = route.params;
  
  // Parse dates from string format
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    const parts = dateString.split('/');
    if (parts.length !== 3) return new Date();
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };
  
  const [name, setName] = useState(goal.tên_mục_tiêu || '');
  const [targetAmount, setTargetAmount] = useState(goal.số_tiền_mục_tiêu || '');
  const [currentAmount, setCurrentAmount] = useState(goal.số_tiền_hiện_tại || '');
  const [startDate, setStartDate] = useState(parseDate(goal.ngày_bắt_đầu));
  const [endDate, setEndDate] = useState(parseDate(goal.ngày_kết_thúc));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên mục tiêu');
      return false;
    }
    
    if (!targetAmount.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền mục tiêu');
      return false;
    }
    
    if (isNaN(parseFloat(targetAmount))) {
      Alert.alert('Lỗi', 'Số tiền mục tiêu phải là số');
      return false;
    }
    
    if (currentAmount.trim() && isNaN(parseFloat(currentAmount))) {
      Alert.alert('Lỗi', 'Số tiền hiện tại phải là số');
      return false;
    }
    
    if (endDate <= startDate) {
      Alert.alert('Lỗi', 'Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }
    
    return true;
  };
  
  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const updatedGoal = {
        tên_mục_tiêu: name.trim(),
        số_tiền_mục_tiêu: targetAmount.trim(),
        số_tiền_hiện_tại: currentAmount.trim() || '0',
        ngày_bắt_đầu: formatDate(startDate),
        ngày_kết_thúc: formatDate(endDate)
      };
      
      await updateGoal(index, updatedGoal);
      
      Alert.alert(
        'Thành công',
        'Đã cập nhật mục tiêu tài chính thành công',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Goals', { refresh: true }) 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa mục tiêu này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleteLoading(true);
              await deleteGoal(index);
              
              Alert.alert(
                'Thành công',
                'Đã xóa mục tiêu tài chính thành công',
                [
                  { 
                    text: 'OK', 
                    onPress: () => navigation.navigate('Goals', { refresh: true }) 
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Lỗi', error.message);
            } finally {
              setDeleteLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  
  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <View style={[globalStyles.glassHeader, { backgroundColor: colors.glass }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: `${colors.text}10` }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[globalStyles.title, { color: colors.text }]}>Chỉnh sửa mục tiêu</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin mục tiêu</Text>
          
          {/* Tên mục tiêu */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tên mục tiêu</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: `${colors.text}05`,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên mục tiêu"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          {/* Số tiền mục tiêu */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Số tiền mục tiêu</Text>
            <View style={[
              styles.amountInputContainer,
              { 
                backgroundColor: `${colors.text}05`,
                borderColor: colors.border
              }
            ]}>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.currencyText, { color: colors.textSecondary }]}>đ</Text>
            </View>
          </View>
          
          {/* Số tiền hiện tại */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Số tiền hiện tại</Text>
            <View style={[
              styles.amountInputContainer,
              { 
                backgroundColor: `${colors.text}05`,
                borderColor: colors.border
              }
            ]}>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={currentAmount}
                onChangeText={setCurrentAmount}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.currencyText, { color: colors.textSecondary }]}>đ</Text>
            </View>
          </View>
          
          {/* Ngày bắt đầu */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Ngày bắt đầu</Text>
            <TouchableOpacity
              style={[
                styles.dateInput,
                { 
                  backgroundColor: `${colors.text}05`,
                  borderColor: colors.border
                }
              ]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={{ color: colors.text }}>{formatDate(startDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
              />
            )}
          </View>
          
          {/* Ngày kết thúc */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Ngày kết thúc</Text>
            <TouchableOpacity
              style={[
                styles.dateInput,
                { 
                  backgroundColor: `${colors.text}05`,
                  borderColor: colors.border
                }
              ]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={{ color: colors.text }}>{formatDate(endDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
              />
            )}
          </View>
          
          {/* Nút cập nhật */}
          <Button 
            title={loading ? "Đang cập nhật..." : "Cập nhật mục tiêu"}
            onPress={handleUpdate}
            disabled={loading || deleteLoading}
            style={styles.submitButton}
          />
          
          {/* Nút xóa */}
          <Button 
            title={deleteLoading ? "Đang xóa..." : "Xóa mục tiêu"}
            onPress={handleDelete}
            disabled={loading || deleteLoading}
            style={styles.deleteButton}
            outline
            textStyle={{ color: colors.danger }}
          />
          
          {(loading || deleteLoading) && (
            <ActivityIndicator 
              size="large" 
              color={colors.primary} 
              style={styles.loadingIndicator} 
            />
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  submitButton: {
    marginTop: 16,
  },
  deleteButton: {
    marginTop: 12,
  },
  loadingIndicator: {
    marginTop: 16,
  },
});

export default EditGoalScreen;