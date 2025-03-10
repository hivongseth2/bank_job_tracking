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
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { addBudget } from '../services/api';

const CATEGORY_ICONS = [
  { id: 'restaurant-outline', name: 'Ăn uống' },
  { id: 'car-outline', name: 'Di chuyển' },
  { id: 'cart-outline', name: 'Mua sắm' },
  { id: 'film-outline', name: 'Giải trí' },
  { id: 'receipt-outline', name: 'Hóa đơn' },
  { id: 'home-outline', name: 'Nhà cửa' },
  { id: 'medkit-outline', name: 'Sức khỏe' },
  { id: 'school-outline', name: 'Giáo dục' },
  { id: 'gift-outline', name: 'Quà tặng' },
  { id: 'wallet-outline', name: 'Khác' },
];

const AddBudgetScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('wallet-outline');
  const [loading, setLoading] = useState(false);
  
  const validateForm = () => {
    if (!category.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return false;
    }
    
    if (!limit.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return false;
    }
    
    if (!limit.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập hạn mức ngân sách');
      return false;
    }
    
    if (isNaN(parseFloat(limit))) {
      Alert.alert('Lỗi', 'Hạn mức ngân sách phải là số');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const budget = {
        danh_mục: category.trim(),
        hạn_mức: limit.trim(),
        đã_chi: '0',
        icon: selectedIcon
      };
      
      await addBudget(budget);
      
      Alert.alert(
        'Thành công',
        'Đã thêm ngân sách mới thành công',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('BudgetMain', { refresh: true }) 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const renderIconItem = (icon) => {
    const isSelected = selectedIcon === icon.id;
    
    return (
      <TouchableOpacity
        key={icon.id}
        style={[
          styles.iconItem,
          isSelected && { backgroundColor: `${colors.primary}20` }
        ]}
        onPress={() => setSelectedIcon(icon.id)}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
          <Ionicons name={icon.id} size={24} color={isSelected ? colors.primary : colors.textSecondary} />
        </View>
        <Text style={[
          styles.iconName,
          { color: isSelected ? colors.primary : colors.text }
        ]}>
          {icon.name}
        </Text>
      </TouchableOpacity>
    );
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
          <Text style={[globalStyles.title, { color: colors.text }]}>Thêm ngân sách mới</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin ngân sách</Text>
          
          {/* Tên danh mục */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tên danh mục</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: `${colors.text}05`,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={category}
              onChangeText={setCategory}
              placeholder="Nhập tên danh mục"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          {/* Hạn mức */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Hạn mức ngân sách</Text>
            <View style={[
              styles.amountInputContainer,
              { 
                backgroundColor: `${colors.text}05`,
                borderColor: colors.border
              }
            ]}>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={limit}
                onChangeText={setLimit}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.currencyText, { color: colors.textSecondary }]}>đ</Text>
            </View>
          </View>
          
          {/* Biểu tượng */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Biểu tượng</Text>
            <View style={styles.iconsContainer}>
              {CATEGORY_ICONS.map(renderIconItem)}
            </View>
          </View>
          
          {/* Nút lưu */}
          <Button 
            title={loading ? "Đang lưu..." : "Lưu ngân sách"}
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
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  iconItem: {
    width: '20%',
    padding: 4,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconName: {
    fontSize: 12,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 16,
  },
  loadingIndicator: {
    marginTop: 16,
  },
});

export default AddBudgetScreen;