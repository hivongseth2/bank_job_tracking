import React, { useState, useContext, useEffect } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Switch,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsItem from '../components/settings/SettingsItem';
// import { Switch } from '@rneui/themed';
const SettingsScreen = ({ navigation }) => {
  const { colors, theme, toggleTheme} = useContext(ThemeContext);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  
  // Đồng bộ state với theme hiện tại
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);
  
  const handleThemeChange = (value) => {
    const newTheme = value ? 'dark' : 'light';
    setIsDarkMode(value);
    toggleTheme()
    // AsyncStorage.setItem('theme', newTheme);
  };
  
  const handleNotificationsChange = (value) => {
    setNotificationsEnabled(value);
    // Lưu cài đặt thông báo
    AsyncStorage.setItem('notifications_enabled', value.toString());
  };
  
  const handleBiometricsChange = (value) => {
    setBiometricsEnabled(value);
    // Lưu cài đặt sinh trắc học
    AsyncStorage.setItem('biometrics_enabled', value.toString());
    
    if (value) {
      Alert.alert(
        'Xác nhận',
        'Bạn có muốn thiết lập xác thực sinh trắc học ngay bây giờ?',
        [
          {
            text: 'Để sau',
            style: 'cancel',
          },
          {
            text: 'Thiết lập',
            onPress: () => {
              // Mở màn hình thiết lập sinh trắc học
              Alert.alert('Thông báo', 'Tính năng đang phát triển');
            },
          },
        ]
      );
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            // Xử lý đăng xuất
            Alert.alert('Thông báo', 'Đã đăng xuất thành công');
          },
        },
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Xác nhận xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa tài khoản',
          style: 'destructive',
          onPress: () => {
            // Xử lý xóa tài khoản
            Alert.alert('Thông báo', 'Tính năng đang phát triển');
          },
        },
      ]
    );
  };
  
  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy');
  };
  
  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms-of-service');
  };
  
  const openHelpCenter = () => {
    Linking.openURL('https://example.com/help-center');
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <View style={[globalStyles.glassHeader, { backgroundColor: colors.glass }]}>
        <Text style={[globalStyles.title, { color: colors.text }]}>Cài đặt</Text>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Hồ sơ người dùng */}
        <View style={[styles.profileCard, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
          <View style={[styles.profileAvatar, { backgroundColor: `${colors.primary}20` }]}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>Người dùng</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>user@example.com</Text>
          </View>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: `${colors.text}10` }]}>
            <Ionicons name="pencil" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Tính năng mới */}
        <SettingsSection title="Tính năng mới">
          <SettingsItem
            icon="briefcase-outline"
            title="Theo dõi công việc"
            subtitle="Quản lý các công việc đã apply"
            onPress={() => navigation.navigate('Jobs')}
            showChevron
          />
          <SettingsItem
            icon="chatbubbles-outline"
            title="Chat với AI"
            subtitle="Thảo luận với nhiều AI cùng lúc"
            onPress={() => navigation.navigate('AIChat')}
            showChevron
          />
        </SettingsSection>
        
        {/* Cài đặt chung */}
        <SettingsSection title="Cài đặt chung">
        <SettingsItem
        icon="moon-outline"
        title="Chế độ tối"
        control={
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.textSecondary, true: colors.primary }}
            thumbColor={isDarkMode ? colors.primary : colors.white}
          />
        }
      />
          <SettingsItem
            icon="notifications-outline"
            title="Thông báo"
            control={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsChange}
                trackColor={{ false: `${colors.textSecondary}50`, true: `${colors.primary}50` }}
                thumbColor={notificationsEnabled ? colors.primary : colors.textSecondary}
              />
            }
          />
          <SettingsItem
            icon="finger-print-outline"
            title="Xác thực sinh trắc học"
            control={
              <Switch
                value={biometricsEnabled}
                onValueChange={handleBiometricsChange}
                trackColor={{ false: `${colors.textSecondary}50`, true: `${colors.primary}50` }}
                thumbColor={biometricsEnabled ? colors.primary : colors.textSecondary}
              />
            }
          />
          <SettingsItem
            icon="language-outline"
            title="Ngôn ngữ"
            subtitle="Tiếng Việt"
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
            showChevron
          />
          <SettingsItem
            icon="cash-outline"
            title="Đơn vị tiền tệ"
            subtitle="VND"
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
            showChevron
          />
        </SettingsSection>
        
        {/* Kết nối */}
        <SettingsSection title="Kết nối">
          <SettingsItem
            icon="cloud-outline"
            title="Kết nối Google Sheets"
            subtitle="Đồng bộ dữ liệu với Google Sheets"
            onPress={() => navigation.navigate('Integrations')}
            showChevron
          />
          <SettingsItem
            icon="sync-outline"
            title="Đồng bộ dữ liệu"
            subtitle="Đồng bộ dữ liệu với các thiết bị khác"
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
            showChevron
          />
        </SettingsSection>
        
        {/* Hỗ trợ */}
        <SettingsSection title="Hỗ trợ">
          <SettingsItem
            icon="help-circle-outline"
            title="Trung tâm trợ giúp"
            onPress={openHelpCenter}
            showChevron
          />
          <SettingsItem
            icon="document-text-outline"
            title="Điều khoản dịch vụ"
            onPress={openTermsOfService}
            showChevron
          />
          <SettingsItem
            icon="shield-outline"
            title="Chính sách bảo mật"
            onPress={openPrivacyPolicy}
            showChevron
          />
          <SettingsItem
            icon="information-circle-outline"
            title="Phiên bản"
            subtitle="1.0.0"
          />
        </SettingsSection>
        
        {/* Tài khoản */}
        <SettingsSection title="Tài khoản">
          <SettingsItem
            icon="log-out-outline"
            title="Đăng xuất"
            titleStyle={{ color: colors.danger }}
            onPress={handleLogout}
          />
          <SettingsItem
            icon="trash-outline"
            title="Xóa tài khoản"
            titleStyle={{ color: colors.danger }}
            onPress={handleDeleteAccount}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen;