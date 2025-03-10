import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import GoalsScreen from '../screens/GoalsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import IntegrationsScreen from '../screens/IntegrationsScreen';
import AddBudgetScreen from '../screens/AddBudgetScreen';
import EditBudgetScreen from '../screens/EditBudgetScreen';
import JobsScreen from '../screens/JobsScreen';
import AIChatScreen from '../screens/AIChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Integrations" component={IntegrationsScreen} />
      <Stack.Screen name="Jobs" component={JobsScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
    </Stack.Navigator>
  );
};

const BudgetStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BudgetMain" component={BudgetScreen} />
      <Stack.Screen name="AddBudget" component={AddBudgetScreen} />
      <Stack.Screen name="EditBudget" component={EditBudgetScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
    </Stack.Navigator>
  );
};

const StatisticsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StatisticsMain" component={StatisticsScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Integrations" component={IntegrationsScreen} />
      <Stack.Screen name="Jobs" component={JobsScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { colors } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Statistics') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Budget') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.glass,
            borderTopColor: colors.glassBorder,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{ 
            tabBarLabel: 'Trang chủ',
          }}
        />
        <Tab.Screen 
          name="Statistics" 
          component={StatisticsStack} 
          options={{ 
            tabBarLabel: 'Thống kê',
          }}
        />
        <Tab.Screen 
          name="Budget" 
          component={BudgetStack} 
          options={{ 
            tabBarLabel: 'Ngân sách',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsStack} 
          options={{ 
            tabBarLabel: 'Cài đặt',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;