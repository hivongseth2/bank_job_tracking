import React, { useState, useContext, useEffect } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const IntegrationsScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [sheetId, setSheetId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  
  // Tải cấu hình từ AsyncStorage khi màn hình được tải
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const savedSheetId = await AsyncStorage.getItem('SHEET_ID');
        const savedApiKey = await AsyncStorage.getItem('API_KEY');
        const savedAutoSync = await AsyncStorage.getItem('AUTO_SYNC');
        
        if (savedSheetId) setSheetId(savedSheetId);
        if (savedApiKey) setApiKey(savedApiKey);
        if (savedAutoSync !== null) setAutoSync(savedAutoSync === 'true');
        
        // Kiểm tra kết nối nếu đã có thông tin
        if (savedSheetId && savedApiKey) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadConfig();
  }, []);
  
  // Lưu cấu hình vào AsyncStorage
  const saveConfig = async () => {
    if (!sheetId.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập ID Google Sheet');
      return;
    }
    
    if (!apiKey.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập API Key');
      return;
    }
    
    try {
      setLoading(true);
      
      // Lưu cấu hình
      await AsyncStorage.setItem('SHEET_ID', sheetId.trim());
      await AsyncStorage.setItem('API_KEY', apiKey.trim());
      await AsyncStorage.setItem('AUTO_SYNC', autoSync.toString());
      
      // Kiểm tra kết nối
      const testResult = await testConnection();
      
      if (testResult) {
        setIsConnected(true);
        Alert.alert(
          'Thành công',
          'Đã kết nối thành công với Google Sheets',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Kiểm tra kết nối với Google Sheets
  const testConnection = async () => {
    try {
      setTestLoading(true);
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId.trim()}?key=${apiKey.trim()}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        throw new Error(data.error?.message || 'Không thể kết nối với Google Sheets');
      }
    } catch (error) {
      console.error('Test connection error:', error);
      Alert.alert('Lỗi kết nối', error.message);
      return false;
    } finally {
      setTestLoading(false);
    }
  };
  
  // Xóa cấu hình
  const clearConfig = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa cấu hình kết nối?',
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
              setLoading(true);
              await AsyncStorage.removeItem('SHEET_ID');
              await AsyncStorage.removeItem('API_KEY');
              
              setSheetId('');
              setApiKey('');
              setIsConnected(false);
              
              Alert.alert('Thành công', 'Đã xóa cấu hình kết nối');
            } catch (error) {
              Alert.alert('Lỗi', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  // Mở hướng dẫn tạo API Key
  const openApiKeyGuide = () => {
    Linking.openURL('https://developers.google.com/sheets/api/guides/authorizing#APIKey');
  };
  
  // Mở Google Sheets
  const openGoogleSheets = () => {
    Linking.openURL('https://docs.google.com/spreadsheets');
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
          <Text style={[globalStyles.title, { color: colors.text }]}>Kết nối Google Sheets</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cấu hình kết nối</Text>
          
          <View style={[styles.status , { color: colors.text }]}> <Text>Cấu hình kết nối</Text> </View>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusIconContainer}>
              <Ionicons 
                name={isConnected ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={isConnected ? colors.success : colors.danger} 
              />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>
                {isConnected ? "Đã kết nối" : "Chưa kết nối"}
              </Text>
              <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                {isConnected 
                  ? "Ứng dụng đã được kết nối với Google Sheets của bạn" 
                  : "Vui lòng cung cấp thông tin để kết nối với Google Sheets"}
              </Text>
            </View>
          </View>
          
          {/* Google Sheet ID */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Google Sheet ID</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: `${colors.text}05`,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={sheetId}
              onChangeText={setSheetId}
              placeholder="Nhập ID của Google Sheet"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              ID nằm trong URL của Google Sheet: https://docs.google.com/spreadsheets/d/<Text style={{ fontWeight: 'bold' }}>spreadsheetId</Text>/edit
            </Text>
          </View>
          
          {/* API Key */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Google API Key</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: `${colors.text}05`,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Nhập Google API Key"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              editable={!loading}
            />
            <TouchableOpacity onPress={openApiKeyGuide}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Hướng dẫn tạo API Key
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Tự động đồng bộ */}
          <View style={styles.switchContainer}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Tự động đồng bộ</Text>
              <Text style={[styles.switchDescription, { color: colors.textSecondary }]}>
                Tự động đồng bộ dữ liệu khi mở ứng dụng
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: `${colors.textSecondary}50`, true: `${colors.primary}50` }}
              thumbColor={autoSync ? colors.primary : colors.textSecondary}
              disabled={loading}
            />
          </View>
          
          {/* Nút lưu */}
          <Button 
            title={loading ? "Đang lưu..." : "Lưu cấu hình"}
            onPress={saveConfig}
            disabled={loading || testLoading}
            style={styles.submitButton}
          />
          
          {/* Nút kiểm tra kết nối */}
          <Button 
            title={testLoading ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
            onPress={testConnection}
            disabled={loading || testLoading || !sheetId || !apiKey}
            style={styles.testButton}
            outline
          />
          
          {/* Nút xóa cấu hình */}
          {isConnected && (
            <Button 
              title="Xóa cấu hình"
              onPress={clearConfig}
              disabled={loading || testLoading}
              style={styles.clearButton}
              outline
              textStyle={{ color: colors.danger }}
            />
          )}
          
          {(loading || testLoading) && (
            <ActivityIndicator 
              size="large" 
              color={colors.primary} 
              style={styles.loadingIndicator} 
            />
          )}
        </Card>
        
        <Card style={styles.guideCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hướng dẫn cấu hình Google Sheets</Text>
          
          <Text style={[styles.guideText, { color: colors.text }]}>
            Để sử dụng ứng dụng với Google Sheets, bạn cần:
          </Text>
          
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Tạo Google Sheet mới</Text>
              <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                Tạo một Google Sheet mới với các sheet sau:
              </Text>
              <View style={styles.sheetStructure}>
                <Text style={[styles.sheetName, { color: colors.text }]}>Sheet1 (Giao dịch)</Text>
                <Text style={[styles.columnNames, { color: colors.textSecondary }]}>
                  Ngày giao dịch | Mô tả | Số tiền | Nguồn tiền | Loại giao dịch | Số dư
                </Text>
              </View>
              <View style={styles.sheetStructure}>
                <Text style={[styles.sheetName, { color: colors.text }]}>Sheet2 (Ngân sách)</Text>
                <Text style={[styles.columnNames, { color: colors.textSecondary }]}>
                  Danh mục | Hạn mức | Đã chi | Icon
                </Text>
              </View>
              <View style={styles.sheetStructure}>
                <Text style={[styles.sheetName, { color: colors.text }]}>Sheet3 (Mục tiêu)</Text>
                <Text style={[styles.columnNames, { color: colors.textSecondary }]}>
                  Tên mục tiêu | Số tiền mục tiêu | Số tiền hiện tại | Ngày bắt đầu | Ngày kết thúc
                </Text>
              </View>
              <View style={styles.sheetStructure}>
                <Text style={[styles.sheetName, { color: colors.text }]}>Sheet4 (Công việc)</Text>
                <Text style={[styles.columnNames, { color: colors.textSecondary }]}>
                  Ngày gửi | Tiêu đề công việc | Tên công ty | Mức lương | Địa điểm | Tên file CV | Nguồn
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.openSheetsButton}
                onPress={openGoogleSheets}
              >
                <Text style={[styles.openSheetsText, { color: colors.primary }]}>
                  Mở Google Sheets
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Chia sẻ quyền truy cập</Text>
              <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                Đảm bảo Google Sheet của bạn được chia sẻ công khai (chỉ xem) hoặc với API Key của bạn.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Nhập thông tin kết nối</Text>
              <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                Nhập Google Sheet ID và API Key vào form ở trên và nhấn "Lưu cấu hình".
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statusIconContainer: {
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
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
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  linkText: {
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
  },
  submitButton: {
    marginBottom: 12,
  },
  testButton: {
    marginBottom: 12,
  },
  clearButton: {
    marginBottom: 12,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  guideCard: {
    marginTop: 16,
  },
  guideText: {
    fontSize: 16,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  sheetStructure: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  sheetName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  columnNames: {
    fontSize: 12,
  },
  openSheetsButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  openSheetsText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default IntegrationsScreen;