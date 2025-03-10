import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsItem from '../components/settings/SettingsItem';

const NotificationsScreen = ({ navigation }) => {
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [balanceAlerts, setBalanceAlerts] = useState(false);
  const [marketingAlerts, setMarketingAlerts] = useState(false);
  
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
          <Text style={globalStyles.title}>Cài đặt thông báo</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SettingsSection title="Thông báo giao dịch">
          <SettingsItem 
            title="Thông báo giao dịch mới" 
            subtitle="Nhận thông báo khi có giao dịch mới"
            icon="card-outline"
            switchValue={transactionAlerts}
            onSwitchChange={setTransactionAlerts}
          />
          <SettingsItem 
            title="Thông báo giao dịch lớn" 
            subtitle="Nhận thông báo khi có giao dịch vượt quá 1.000.000đ"
            icon="alert-circle-outline"
            switchValue={true}
            onSwitchChange={() => {}}
            disabled={!transactionAlerts}
          />
          <SettingsItem 
            title="Thông báo giao dịch bất thường" 
            subtitle="Nhận thông báo khi phát hiện giao dịch bất thường"
            icon="shield-outline"
            switchValue={true}
            onSwitchChange={() => {}}
            disabled={!transactionAlerts}
          />
        </SettingsSection>
        
        <SettingsSection title="Thông báo ngân sách">
          <SettingsItem 
            title="Cảnh báo ngân sách" 
            subtitle="Nhận thông báo khi chi tiêu gần đạt ngưỡng ngân sách"
            icon="wallet-outline"
            switchValue={budgetAlerts}
            onSwitchChange={setBudgetAlerts}
          />
          <SettingsItem 
            title="Ngưỡng cảnh báo" 
            subtitle="Nhận thông báo khi đạt 80% ngân sách"
            icon="trending-up-outline"
            rightComponent={
              <Text style={styles.valueText}>80%</Text>
            }
            onPress={() => {}}
            disabled={!budgetAlerts}
          />
        </SettingsSection>
        
        <SettingsSection title="Thông báo mục tiêu">
          <SettingsItem 
            title="Cập nhật mục tiêu" 
            subtitle="Nhận thông báo về tiến độ mục tiêu tài chính"
            icon="flag-outline"
            switchValue={goalAlerts}
            onSwitchChange={setGoalAlerts}
          />
          <SettingsItem 
            title="Tần suất cập nhật" 
            subtitle="Nhận thông báo hàng tuần"
            icon="time-outline"
            rightComponent={
              <Text style={styles.valueText}>Hàng tuần</Text>
            }
            onPress={() => {}}
            disabled={!goalAlerts}
          />
        </SettingsSection>
        
        <SettingsSection title="Thông báo khác">
          <SettingsItem 
            title="Cảnh báo số dư thấp" 
            subtitle="Nhận thông báo khi số dư dưới ngưỡng"
            icon="cash-outline"
            switchValue={balanceAlerts}
            onSwitchChange={setBalanceAlerts}
          />
          <SettingsItem 
            title="Ngưỡng số dư thấp" 
            subtitle="Nhận thông báo khi số dư dưới 1.000.000đ"
            icon="trending-down-outline"
            rightComponent={
              <Text style={styles.valueText}>1.000.000đ</Text>
            }
            onPress={() => {}}
            disabled={!balanceAlerts}
          />
          <SettingsItem 
            title="Thông báo tiếp thị" 
            subtitle="Nhận thông báo về ưu đãi và tính năng mới"
            icon="megaphone-outline"
            switchValue={marketingAlerts}
            onSwitchChange={setMarketingAlerts}
          />
        </SettingsSection>
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
  valueText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default NotificationsScreen;