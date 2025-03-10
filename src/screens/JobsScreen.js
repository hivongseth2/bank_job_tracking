import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import { fetchJobs, deleteJob } from '../services/api';
import SourceFilter from '../components/job/SourceFilter';
import MonthFilter from '../components/job/MonthFilter';

const JobsScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [sources, setSources] = useState(['All']);
  const [selectedSource, setSelectedSource] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const months = [
    'All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const [selectedMonth, setSelectedMonth] = useState('All');
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jobsData = await fetchJobs();
      
      // Sắp xếp công việc theo thời gian, mới nhất lên đầu
      const sortedJobs = [...jobsData].sort((a, b) => {
        const dateA = a.ngày_gửi ? new Date(a.ngày_gửi.split('/').reverse().join('-')) : new Date(0);
        const dateB = b.ngày_gửi ? new Date(b.ngày_gửi.split('/').reverse().join('-')) : new Date(0);
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
      });
      
      setJobs(sortedJobs);
      setFilteredJobs(sortedJobs);
      
      // Lấy danh sách nguồn duy nhất
      const sourcesList = ['All', ...new Set(sortedJobs.map(job => job.nguồn).filter(Boolean))];
      setSources(sourcesList);
      
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const filterJobs = () => {
    let filtered = jobs;
    
    if (selectedSource !== 'All') {
      filtered = filtered.filter(job => job.nguồn === selectedSource);
    }
    
    if (selectedMonth !== 'All') {
      filtered = filtered.filter(job => {
        const jobMonth = new Date(job.ngày_gửi.split('/').reverse().join('-')).getMonth();
        return jobMonth === parseInt(selectedMonth) - 1; // -1 because months are 0-indexed
      });
    }
    
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    filterJobs();
  }, [selectedSource, selectedMonth]);
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSourceFilter = (source) => {
    setSelectedSource(source);
    if (source === 'All') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter(job => job.nguồn === source)
      );
    }
  };

  const handleAddJob = () => {
    // Hiển thị form thêm công việc
    Alert.prompt(
      'Thêm công việc mới',
      'Nhập thông tin công việc',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Thêm',
          onPress: (text) => {
            // Xử lý thêm công việc
            Alert.alert('Thông báo', 'Tính năng đang phát triển');
          },
        },
      ],
      'plain-text'
    );
  };

  const handleEditJob = (job, index) => {
    // Hiển thị form chỉnh sửa công việc
    Alert.alert(
      'Chỉnh sửa công việc',
      `${job.tiêu_đề_công_việc} - ${job.tên_công_ty}`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Chỉnh sửa',
          onPress: () => {
            // Xử lý chỉnh sửa công việc
            Alert.alert('Thông báo', 'Tính năng đang phát triển');
          },
        },
      ]
    );
  };

  const handleDeleteJob = (job, index) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa công việc "${job.tiêu_đề_công_việc}" tại "${job.tên_công_ty}"?`,
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
              await deleteJob(index);
              Alert.alert('Thành công', 'Đã xóa công việc');
              loadData();
            } catch (error) {
              Alert.alert('Lỗi', error.message);
            }
          },
        },
      ]
    );
  };

  const renderJobItem = ({ item, index }) => {
    return (
      <Card style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={[styles.jobTitle, { color: colors.text }]}>{item.tiêu_đề_công_việc}</Text>
            <Text style={[styles.jobCompany, { color: colors.primary }]}>{item.tên_công_ty}</Text>
          </View>
          <View style={styles.jobActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: `${colors.text}10` }]}
              onPress={() => handleEditJob(item, index)}
            >
              <Ionicons name="pencil" size={16} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: `${colors.danger}10`, marginLeft: 8 }]}
              onPress={() => handleDeleteJob(item, index)}
            >
              <Ionicons name="trash" size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.jobDetails}>
          {item.mức_lương && (
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.mức_lương}</Text>
            </View>
          )}
          
          {item.địa_điểm && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.địa_điểm}</Text>
            </View>
          )}
          
          {item.ngày_gửi && (
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>Ngày gửi: {item.ngày_gửi}</Text>
            </View>
          )}
          
          {item.tên_file_cv && (
            <View style={styles.detailItem}>
              <Ionicons name="document-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>CV: {item.tên_file_cv}</Text>
            </View>
          )}
          
          {item.nguồn && (
            <View style={[styles.sourceTag, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.sourceText, { color: colors.primary }]}>{item.nguồn}</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[globalStyles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

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
          <Text style={[globalStyles.title, { color: colors.text }]}>Theo dõi công việc</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddJob}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.container}>
        {error ? (
          <Card>
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            <TouchableOpacity 
              style={[styles.setupButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Integrations')}
            >
              <Text style={styles.setupButtonText}>Thiết lập kết nối</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <Card style={[styles.statCard, { backgroundColor: colors.glass }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>{jobs.length}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tổng số công việc</Text>
              </Card>
              
              <Card style={[styles.statCard, { backgroundColor: colors.glass }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>{sources.length - 1}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Nguồn tuyển dụng</Text>
              </Card>
            </View>
            <View style={styles.filterContainer}>
        <Dropdown
          style={[styles.dropdown, { backgroundColor: colors.card }]}
          placeholderStyle={[styles.placeholderStyle, { color: colors.textSecondary }]}
          selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }]}
          data={sources.map(source => ({ label: source, value: source }))}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Chọn nguồn"
          value={selectedSource}
          onChange={item => setSelectedSource(item.value)}
        />
        <Dropdown
          style={[styles.dropdown, { backgroundColor: colors.card }]}
          placeholderStyle={[styles.placeholderStyle, { color: colors.textSecondary }]}
          selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }]}
          data={months.map((month, index) => ({ label: month, value: index.toString() }))}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Chọn tháng"
          value={selectedMonth}
          onChange={item => setSelectedMonth(item.value)}
        />
      </View>
            {/* <SourceFilter 
              sources={sources} 
              selectedSource={selectedSource} 
              onSourceSelect={handleSourceFilter} 
            />
            <MonthFilter 
        selectedMonth={selectedMonth}
        onMonthSelect={setSelectedMonth}
      /> */}



      
            {filteredJobs.length === 0 ? (
              <EmptyState 
                icon="briefcase-outline"
                title="Không có công việc nào"
                message="Bạn chưa thêm công việc nào. Hãy thêm công việc đầu tiên của bạn."
              />
            ) : (
              <FlatList
                data={filteredJobs}
                renderItem={renderJobItem}
                keyExtractor={(item, index) => `job-${index}`}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
              />
            )}
          </>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddJob}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 80,
  },
  jobCard: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    fontWeight: '500',
  },
  jobActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  sourceTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  setupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  setupButtonText: {
    color: 'white',
    fontWeight: '500',
  },

  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dropdown: {
    width: '48%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});

export default JobsScreen;