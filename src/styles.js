import { StyleSheet, Platform } from 'react-native';

export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9500',
  info: '#64D2FF',
  light: '#F5F5F5',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  background: '#F2F2F7',
  card: 'rgba(255, 255, 255, 0.8)',
  cardDark: 'rgba(30, 30, 30, 0.8)',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: 'rgba(200, 200, 200, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Gradient colors
  gradientStart: '#007AFF',
  gradientEnd: '#5856D6',
  
  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.7)',
  glassDark: 'rgba(30, 30, 30, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassShadow: 'rgba(0, 0, 0, 0.05)',

  chartColors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
      android: {
        // Android doesn't support backdropFilter
      },
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  glassHeader: {
    backgroundColor: colors.glass,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
      android: {
        // Android doesn't support backdropFilter
      },
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  glassButton: {
    backgroundColor: colors.glass,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
      android: {
        // Android doesn't support backdropFilter
      },
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginRight: 8,
  },
  chipText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipTextSelected: {
    color: colors.white,
  },
  positiveAmount: {
    color: colors.success,
    fontWeight: 'bold',
  },
  negativeAmount: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonOutlineText: {
    color: colors.primary,
  },
  // Thêm các style mới
  pageContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },


});