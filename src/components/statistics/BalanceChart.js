import { View, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import React, { useState, useEffect, useContext, useCallback } from 'react';

import { ThemeContext } from '../../context/ThemeContext';
import { calculateMonthlyBalance } from "../../utils/transaction"

const BalanceChart = ({ transactions }) => {
  const { colors } = useContext(ThemeContext);
  const monthlyBalance = calculateMonthlyBalance(transactions)

  const chartData = {
    labels: monthlyBalance.map((item) => item.month),
    datasets: [
      {
        data: monthlyBalance.map((item) => item.balance),
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2,
      },
    ],
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel="đ"
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.background,
          backgroundGradientTo: colors.background,
          decimalPlaces: 0,
          color: (opacity = 1) => colors.text,
          labelColor: (opacity = 1) => colors.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: colors.primary,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
})

export default BalanceChart

