import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { fetchJobs, addJob, deleteJob } from '../services/api';

const JobsScreen = ({ navigation, route }) => {
  const { colors } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Form state
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [cvName, setCvName] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date());
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jobsData = await fetchJobs();
      
      // Sắp xếp công việc theo ngày gửi (mới nhất lên đầu)
      jobsData.sort((a, b) => {
        const dateA = parseDate(a.ngày_gửi);
        const dateB = parseDate(b.ngày_gửi);
        return dateB - dateA;
      });
      
      setJobs(jobsData);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        loadData();
        // Reset the parameter to avoid unnecessary refreshes
        navigation.setParams({ refresh: false });
      }
    }, [route.params?.refresh])
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return new Date();
    
    // Chuyển đổi từ DD/MM/YYYY sang Date object
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };
  
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const handleAddJob = async () => {
    if (!validateForm()) return;
    
    try {
      const newJob = {
        ngày_gửi: formatDate(date),
        tiêu_đề_công_việc: jobTitle,
        tên_công_ty: company,
        mức_lương: salary,
        địa_điểm: location,
        tên_file_cv: cvName,
        nguồn: source
      };
      
      await addJob(newJob);
      
      // Reset form
      resetForm();
      
      // Close modal
      setModalVisible(false);
      
      // Reload data
      loadData();
      
      Alert.alert('Thành công', 'Đã thêm công việc mới thành công');
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };
  
  const handleDeleteJob = async (index) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa công việc này?',
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
              loadData();
              Alert.alert('Thành công', 'Đã xóa công việc thành công');
            } catch (error) {
              Alert.alert('Lỗi', error.message);
            }
          },
        },
      ]
    );
  };
  
  const validateForm = () => {
    if (!jobTitle.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề công việc');
      return false;
    }
    
    if (!company.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên công ty');
      return false;
    }
    
    return true;
  };
  
  const resetForm = () => {
    setJobTitle('');
    setCompany('');
    setSalary('');
    setLocation('');
    setCvName('');
    setSource('');
    setDate(new Date());
  };
  
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  
  const renderJobItem = (job, index) => {
    return (
      <Card key={index} style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={[styles.jobTitle, { color: colors.text }]}>{job.tiêu_đề_công_việc}</Text>
            <Text style={[styles.companyName, { color: colors.primary }]}>{job.tên_công_ty}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: `${colors.danger}20` }]}
            onPress={() => handleDeleteJob(index)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.jobDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{job.ngày_gửi}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {job.mức_lương || 'Thương lượng'}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {job.địa_điểm || 'Không xác định'}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="document-outline" size={16} color={colors.textSecondary} />
              <Text 
                style={[styles.detailText, { color: colors.textSecondary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {job.tên_file_cv || 'Không có CV'}
              </Text>
            </View>
          </View>
          
          {job.nguồn && (
            <View style={[styles.sourceTag, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.sourceText, { color: colors.primary }]}>{job.nguồn}</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };
  
  const renderAddJobModal = () => {
    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Thêm công việc mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Ngày gửi */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Ngày gửi</Text>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    { 
                      backgroundColor: `${colors.text}05`,
                      borderColor: colors.border
                    }
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: colors.text }}>{formatDate(date)}</Text>
                  <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </View>
              
              {/* Tiêu đề công việc */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Tiêu đề công việc *</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: `${colors.text}05`,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  value={jobTitle}
                  onChangeText={setJobTitle}
                  placeholder="Nhập tiêu đề công việc"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              {/* Tên công ty */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Tên công ty *</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: `${colors.text}05`,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  value={company}
                  onChangeText={setCompany}
                  placeholder="Nhập tên công ty"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              {/* Mức lương */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Mức lương</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: `${colors.text}05`,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  value={salary}
                  onChangeText={setSalary}
                  placeholder="Nhập mức lương (hoặc 'Thương lượng')"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              {/* Địa điểm */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Địa điểm</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: `${colors.text}05`,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Nhập địa điểm làm việc"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              {/* Tên file CV */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Tên file CV</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: `${colors.text}05`,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  value={cvName}
                  onChangeText={setCvName}
                  placeholder="Nhập tên file CV đã gửi"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              {/* Nguồn */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Nguồn</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: `${colors.text}05`,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  value={source}
                  onChangeText={setSource}
                  placeholder="Nhập nguồn tìm việc (VietnamWorks, TopCV, ...)"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button 
                title="Hủy" 
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
                outline
              />
              <Button 
                title="Thêm" 
                onPress={handleAddJob}
                style={styles.addButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[globalStyles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải dữ liệu công việc...</Text>
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
            style={[styles.addButton, { backgroundColor: `${colors.primary}20` }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {error && (
          <Card>
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            <Button 
              title="Thử lại" 
              onPress={loadData}
              style={styles.retryButton}
            />
          </Card>
        )}
        
        {jobs.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title="Chưa có công việc nào"
            description="Bạn chưa theo dõi công việc nào. Hãy thêm công việc đầu tiên của bạn."
            buttonTitle="Thêm công việc mới"
            onButtonPress={() => setModalVisible(true)}
          />
        ) : (
          <>
            <View style={styles.statsCard}>
              <Card>
                <Text style={[styles.statsTitle, { color: colors.text }]}>Tổng quan</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>{jobs.length}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tổng số</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.success }]}>
                      {jobs.filter(job => job.nguồn === 'LinkedIn').length}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>LinkedIn</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.warning }]}>
                      {jobs.filter(job => job.nguồn === 'TopCV').length}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>TopCV</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.info }]}>
                      {jobs.filter(job => job.nguồn === 'VietnamWorks').length}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>VietnamWorks</Text>
                  </View>
                </View>
              </Card>
            </View>
            
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Danh sách công việc</Text>
              <TouchableOpacity 
                style={[styles.filterButton, { backgroundColor: `${colors.primary}20` }]}
                onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
              >
                <Ionicons name="filter-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {jobs.map((job, index) => renderJobItem(job, index))}
          </>
        )}
      </ScrollView>
      
      {renderAddJobModal()}
      
      <TouchableOpacity 
        style={[
          styles.floatingButton, 
          { backgroundColor: colors.primary }
        ]}
        onPress={() => setModalVisible(true)}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  companyName: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  sourceTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
    maxHeight: '70%',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  cancelButton: {
    marginRight: 8,
  },
  addButton: {
    minWidth: 100,
  },
});

export default JobsScreen;