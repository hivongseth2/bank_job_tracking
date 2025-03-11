"use client"

import { useState, useEffect, useContext, useCallback, useRef } from "react"
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from "react-native"
import styles from "../styles/HomeStyle"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { ThemeContext } from "../context/ThemeContext"
import { globalStyles } from "../styles"
import Card from "../components/common/Card"
import TransactionList from "../components/transaction/TransactionList"
import BalanceChart from "../components/statistics/BalanceChart"
import SummaryCard from "../components/statistics/SummaryCard"
import CurrentBalanceCard from "../components/statistics/CurrentBalanceCard"
import BankSummary from "../components/statistics/BankSummary"
import { fetchTransactions, getBanks } from "../services/api"
import { QUICK_ACTIONS } from "../config/quickActionsConfig"
import { getCurrentBalance,calculateExpense,calculateIncome,calculateBalance } from "../utils/transaction"

const HEADER_MAX_HEIGHT = 350
const HEADER_MIN_HEIGHT = 140
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const HomeScreen = ({ navigation }) => {
  const { colors, theme } = useContext(ThemeContext)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [banks, setBanks] = useState(["All"])
  const [selectedBank, setSelectedBank] = useState("All")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const scrollY = useRef(new Animated.Value(0)).current

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const transactionsData = await fetchTransactions()

      const sortedTransactions = [...transactionsData].sort((a, b) => {
        const dateA = a.ngày_giao_dịch ? new Date(a.ngày_giao_dịch.split("/").reverse().join("-")) : new Date(0)
        const dateB = b.ngày_giao_dịch ? new Date(b.ngày_giao_dịch.split("/").reverse().join("-")) : new Date(0)
        return dateB - dateA
      })

      setTransactions(sortedTransactions)
      setFilteredTransactions(sortedTransactions)

      const banksList = getBanks(sortedTransactions)
      setBanks(banksList)
    } catch (err) {
      console.error("Error loading data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, []),
  )

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const handleBankFilter = (bank) => {
    setSelectedBank(bank)
    if (bank === "All") {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(transactions.filter((transaction) => transaction.nguồn_tiền === bank))
    }
  }

  const handleAddTransaction = () => {
    navigation.navigate("AddTransaction")
  }

  const handleNotifications = () => {
    navigation.navigate("Notifications")
  }

  const getUserName = () => {
    const hours = new Date().getHours()
    let greeting = ""
    if (hours < 12) {
      greeting = "Chào buổi sáng"
    } else if (hours < 18) {
      greeting = "Chào buổi chiều"
    } else {
      greeting = "Chào buổi tối"
    }
    return `${greeting}, Người dùng!`
  }

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  })

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  })

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  })

  const renderQuickAction = ({ id, icon, label, navigateTo }) => (
    <TouchableOpacity key={id} style={styles.actionButton} onPress={() => navigation.navigate(navigateTo)}>
      <View style={[styles.actionIcon, { backgroundColor: colors.glass }]}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={[styles.actionText, { color: colors.light }]}>{label}</Text>
    </TouchableOpacity>
  )

  const renderHeader = () => (
    <Animated.View style={[styles.header, { height: headerHeight, backgroundColor: colors.primary }]}>
      <View style={styles.headerTop}>
        <Animated.View style={{ opacity: headerContentOpacity }}>
          <Text style={styles.greeting}>{getUserName()}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </Animated.View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.balanceContainer, { opacity: headerContentOpacity }]}>
        <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
        <Text style={styles.balanceAmount}>{calculateBalance(transactions).toLocaleString("vi-VN")} đ</Text>

        <View style={styles.balanceSummary}>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-up-circle" size={16} color={colors.success} />
            <Text style={[styles.balanceItemText, { color: colors.success }]}>
              {calculateIncome(transactions).toLocaleString("vi-VN")} đ
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-down-circle" size={16} color={colors.danger} />
            <Text style={[styles.balanceItemText, { color: colors.danger }]}>
              {calculateExpense(transactions).toLocaleString("vi-VN")} đ
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
        <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
        <Text style={styles.balanceAmount}>{calculateBalance(transactions).toLocaleString("vi-VN")} đ</Text>

        <View style={styles.balanceSummary}>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-up-circle" size={16} color={colors.success} />
            <Text style={[styles.balanceItemText, { color: colors.success }]}>
              {calculateIncome(transactions).toLocaleString("vi-VN")} đ
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-down-circle" size={16} color={colors.danger} />
            <Text style={[styles.balanceItemText, { color: colors.danger }]}>
              {calculateExpense(transactions).toLocaleString("vi-VN")} đ
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={[styles.quickActions, { backgroundColor: colors.primary }]}>
        {QUICK_ACTIONS.map(renderQuickAction)}
      </View>
    </Animated.View>
  )

  const renderContent = () => (
    <>
      {error && (
        <Card>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.setupButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("Integrations")}
          >
            <Text style={styles.setupButtonText}>Thiết lập kết nối</Text>
          </TouchableOpacity>
        </Card>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Tổng quan</Text>
      <View style={styles.summaryContainer}>
        <CurrentBalanceCard
          balances={getCurrentBalance(transactions)}
       
        />
   
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Tính năng mới</Text>
      <View style={styles.featuresContainer}>
        <TouchableOpacity
          style={[
            styles.featureCard,
            { backgroundColor: theme === "dark" ? colors.glass : "#f8f9fa", borderColor: colors.glassBorder },
          ]}
          onPress={() => navigation.navigate("Jobs")}
        >
          <View style={[styles.featureIconContainer, { backgroundColor: `${colors.primary}10` }]}>
            <Ionicons name="briefcase-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Theo dõi công việc</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Quản lý các công việc đã apply
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.featureCard,
            { backgroundColor: theme === "dark" ? colors.glass : "#f8f9fa", borderColor: colors.glassBorder },
          ]}
          onPress={() => navigation.navigate("AIChat")}
        >
          <View style={[styles.featureIconContainer, { backgroundColor: `${colors.primary}10` }]}>
            <Ionicons name="chatbubbles-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Chat với AI</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Thảo luận với nhiều AI cùng lúc
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Biến động số dư</Text>
        <BalanceChart transactions={filteredTransactions} />
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Tổng quan theo ngân hàng</Text>
        <BankSummary transactions={transactions} showFinalBalance={true} />
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Giao dịch gần đây</Text>
      <Card style={styles.transactionsCard}>
        <TransactionList
          transactions={filteredTransactions.slice(0, 5)}
          banks={banks}
          selectedBank={selectedBank}
          onBankSelect={handleBankFilter}
        />

        <TouchableOpacity
          style={[styles.viewAllButton, { borderTopColor: `${colors.text}10` }]}
          onPress={() => navigation.navigate("Statistics")}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>Xem tất cả giao dịch</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </Card>
    </>
  )

  if (loading && !refreshing) {
    return (
      <View style={[globalStyles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải dữ liệu...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}

      <Animated.FlatList
        contentContainerStyle={styles.scrollContent}
        data={[{ key: "content" }]}
        renderItem={() => renderContent()}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressViewOffset={HEADER_MAX_HEIGHT}
          />
        }
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={handleAddTransaction}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}


export default HomeScreen

