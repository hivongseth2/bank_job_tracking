import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../styles';
import Card from '../common/Card';

const screenWidth = Dimensions.get('window').width;

const BalanceChart = ({ 
  data, 
  title = 'Biểu đồ số dư', 
  height = 220,
  width = screenWidth - 32,
  withCard = true,
  noDataMessage = 'Không đủ dữ liệu để hiển thị biểu đồ'
}) => {
  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  const renderChart = () => {
    if (!data || !data.labels || data.labels.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{noDataMessage}</Text>
        </View>
      );
    }

    return (
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    );
  };

  if (withCard) {
    return (
      <Card>
        <Text style={styles.title}>{title}</Text>
        {renderChart()}
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.text,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default BalanceChart;