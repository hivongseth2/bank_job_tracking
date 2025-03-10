import React, { useState } from 'react';
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
import { globalStyles, colors } from '../styles';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { addTransaction } from '../services/api';

const AddTransactionScreen = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [category, setCategory] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  
  const categories = [
    { id: 'income', name: 'Thu nhập', icon: 'trending-up-outline', color: colors.success },
    { id: 'expense', name: 'Chi tiêu', icon: 'trending-down-outline', color: colors.danger },
    { id: 'transfer', name: 'Chuyển tiền', icon: 'swap-horizontal-outline', color: colors.primary },
    { id: 'saving', name: 'Tiết kiệm', icon: 'wallet-outline', color: colors.warning },
    { id: 'investment', name: 'Đầu tư', icon: 'bar-chart-outline', color: colors.info },
  ];
  
  const banks = [
    { id: 'techcombank', name: 'Techcombank', icon: 'card-outline', color: '#F44336' },
    { id: 'vietcombank', name: 'Vietcombank', icon: 'card-outline', color: '#4CAF50' },
    { id: 'momo', name: 'Momo', icon: 'wallet-outline', color: '#9C27B0' },
    { id: 'cash', name: 'Tiền mặt', icon: 'cash-outline', color: '#FF9800' },
  ];
  
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  
  const validateForm = () => {
    if (!description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả giao dịch');
      return false;
    }
    
    if (!amount.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền');
      return false;
    }
    
    if (!bank) {
      Alert.alert('Lỗi', 'Vui lòng chọn nguồn tiền');
      return false;
    }
    
    if (!category) {
      Alert.alert('Lỗi', 'Vui lòng chọn loại giao dịch');
      return false;
    }
    
    if (!balance.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số dư');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Định dạng số tiền
      let formattedAmount = amount.trim();
      if (category === 'expense' || category === 'transfer') {
        // Nếu là chi tiêu hoặc chuyển tiền, thêm dấu trừ
        formattedAmount = `-${formattedAmount}`;
      }
      
      const transaction = {
        ngày_giao_dịch: formatDate(date),
        mô_tả: description.trim(),
        số_tiền: `${formattedAmount} đ`,
        nguồn_tiền: banks.find(b => b.id === bank)?.name || bank,
        loại_giao_dịch: categories.find(c => c.id === category)?.name || category,
        số_dư: `${balance.trim()} đ`
      };
      
      await addTransaction(transaction);
      
      Alert.alert(
        'Thành công',
        'Đã thêm giao dịch mới thành công',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Home', { refresh: true }) 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const renderCategoryItem = (item) => {
    const isSelected = category === item.id;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.categoryItem,
          isSelected && { backgroundColor: `${item.color}20` }
        ]}
        onPress={() => setCategory(item.id)}
      >
        <View style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <Text style={[
          styles.categoryName,
          isSelected && { color: item.color, fontWeight: 'bold' }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderBankItem = (item) => {
    const isSelected = bank === item.id;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.bankItem,
          isSelected && { backgroundColor: `${item.color}20` }
        ]}
        onPress={() => setBank(item.id)}
      >
        <View style={[styles.bankIcon, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <Text style={[
          styles.bankName,
          isSelected && { color: item.color, fontWeight: 'bold' }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.glassHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={globalStyles.title}>Thêm giao dịch mới</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <Text style={styles.sectionTitle}>Thông tin giao dịch</Text>
          
          {/* Ngày giao dịch */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ngày giao dịch</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          
          {/* Mô tả */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Nhập mô tả giao dịch"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          {/* Số tiền */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Số tiền</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.currencyText}>đ</Text>
            </View>
          </View>
          
          {/* Loại giao dịch */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Loại giao dịch</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(renderCategoryItem)}
            </View>
          </View>
          
          {/* Nguồn tiền */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nguồn tiền</Text>
            <View style={styles.banksContainer}>
              {banks.map(renderBankItem)}
            </View>
          </View>
          
          {/* Số dư */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Số dư sau giao dịch</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                value={balance}
                onChangeText={setBalance}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.currencyText}>đ</Text>
            </View>
          </View>
          
          {/* Nút lưu */}
          <Button 
            title={loading ? "Đang lưu..." : "Lưu giao dịch"}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
          
          {loading && (
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
    backgroundColor: `${colors.text}10`,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: `${colors.text}05`,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${colors.text}05`,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.text}05`,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    width: '33.33%',
    padding: 4,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    alignSelf: 'center',
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.text,
  },
  banksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  bankItem: {
    width: '25%',
    padding: 4,
    marginBottom: 8,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    alignSelf: 'center',
  },
  bankName: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.text,
  },
  submitButton: {
    marginTop: 16,
  },
  loadingIndicator: {
    marginTop: 16,
  },
});

export default AddTransactionScreen;