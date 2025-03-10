import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as lightColors } from '../styles';

// Tạo phiên bản màu tối dựa trên màu sáng
const darkColors = {
  ...lightColors,
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  glass: 'rgba(30, 30, 30, 0.8)',
  glassBorder: 'rgba(60, 60, 60, 0.3)',
  primary: '#BB86FC',
  success: '#03DAC5',
  danger: '#CF6679',
  warning: '#FFAB40',
  info: '#64B5F6',
  white: '#FFFFFF',
  black: '#000000',
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colors, setColors] = useState(lightColors);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy chủ đề từ AsyncStorage khi khởi động
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          const isDark = savedTheme === 'dark';
          setIsDarkMode(isDark);
          setColors(isDark ? darkColors : lightColors);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Lưu chủ đề vào AsyncStorage khi thay đổi
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      setColors(newTheme ? darkColors : lightColors);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};