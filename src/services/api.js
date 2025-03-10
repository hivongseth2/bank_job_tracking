import axios from 'axios';

// Thay thế bằng ID Google Sheet của bạn
const SHEET_ID = '1MAYcNLIDCfgqk02M6v16NSNjTMaHyodM2Ii-wpqkBsM';
const API_KEY = 'AIzaSyCgdIucgbJLRZD-tqaariy741HKyjVrnvU';

// Hàm chung để lấy dữ liệu từ một sheet
const fetchSheetData = async (sheetName, range) => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`
    );
    
    const rows = response.data.values;
    
    if (rows && rows.length) {
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const item = {};
        headers.forEach((header, index) => {
          item[header.toLowerCase().replace(/ /g, '_')] = row[index] || '';
        });
        return item;
      });
      
      return data;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching data from ${sheetName}:`, error);
    // Nếu sheet không tồn tại, trả về mảng rỗng
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw new Error(`Không thể tải dữ liệu từ ${sheetName}. Vui lòng kiểm tra kết nối mạng và quyền truy cập Google Sheet.`);
  }
};

// Hàm chung để thêm dữ liệu vào một sheet
const addSheetData = async (sheetName, range, values) => {
  try {
    const body = {
      values: [values]
    };
    
    const response = await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
      body
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error adding data to ${sheetName}:`, error);
    throw new Error(`Không thể thêm dữ liệu vào ${sheetName}. Vui lòng kiểm tra kết nối mạng và quyền truy cập Google Sheet.`);
  }
};

// Hàm chung để cập nhật dữ liệu trong một sheet
const updateSheetData = async (sheetName, rowIndex, values) => {
  try {
    const body = {
      values: [values]
    };
    
    // Lưu ý: rowIndex + 2 vì hàng đầu tiên là tiêu đề và Google Sheets bắt đầu từ 1
    const response = await axios.put(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A${rowIndex + 2}:Z${rowIndex + 2}?valueInputOption=USER_ENTERED&key=${API_KEY}`,
      body
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error updating data in ${sheetName}:`, error);
    throw new Error(`Không thể cập nhật dữ liệu trong ${sheetName}. Vui lòng kiểm tra kết nối mạng và quyền truy cập Google Sheet.`);
  }
};

// Hàm chung để xóa dữ liệu trong một sheet (thực tế là xóa nội dung của hàng)
const deleteSheetData = async (sheetName, rowIndex, columnCount) => {
  try {
    const emptyValues = Array(columnCount).fill("");
    
    const body = {
      values: [emptyValues]
    };
    
    // Lưu ý: rowIndex + 2 vì hàng đầu tiên là tiêu đề và Google Sheets bắt đầu từ 1
    const response = await axios.put(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!A${rowIndex + 2}:Z${rowIndex + 2}?valueInputOption=USER_ENTERED&key=${API_KEY}`,
      body
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error deleting data from ${sheetName}:`, error);
    throw new Error(`Không thể xóa dữ liệu từ ${sheetName}. Vui lòng kiểm tra kết nối mạng và quyền truy cập Google Sheet.`);
  }
};

// Hàm lấy dữ liệu giao dịch từ Sheet1
export const fetchTransactions = async () => {
  return fetchSheetData('Sheet1', 'A:F');
};

// Hàm thêm giao dịch mới vào Sheet1
export const addTransaction = async (transaction) => {
  const values = [
    transaction.ngày_giao_dịch,
    transaction.mô_tả,
    transaction.số_tiền,
    transaction.nguồn_tiền,
    transaction.loại_giao_dịch,
    transaction.số_dư
  ];
  
  return addSheetData('Sheet1', 'A:F', values);
};

// Hàm cập nhật giao dịch trong Sheet1
export const updateTransaction = async (rowIndex, transaction) => {
  const values = [
    transaction.ngày_giao_dịch,
    transaction.mô_tả,
    transaction.số_tiền,
    transaction.nguồn_tiền,
    transaction.loại_giao_dịch,
    transaction.số_dư
  ];
  
  return updateSheetData('Sheet1', rowIndex, values);
};

// Hàm xóa giao dịch từ Sheet1
export const deleteTransaction = async (rowIndex) => {
  return deleteSheetData('Sheet1', rowIndex, 6);
};

// Hàm lấy danh sách ngân hàng từ dữ liệu giao dịch
export const getBanks = (transactions) => {
  if (!transactions || !transactions.length) return ['All'];
  return ['All', ...new Set(transactions.map(item => item.nguồn_tiền).filter(Boolean))];
};

// Hàm lấy dữ liệu ngân sách từ Sheet2
export const fetchBudgets = async () => {
  return fetchSheetData('Sheet2', 'A:D');
};

// Hàm thêm ngân sách mới vào Sheet2
export const addBudget = async (budget) => {
  const values = [
    budget.danh_mục,
    budget.hạn_mức,
    budget.đã_chi,
    budget.icon
  ];
  
  return addSheetData('Sheet2', 'A:D', values);
};

// Hàm cập nhật ngân sách trong Sheet2
export const updateBudget = async (rowIndex, budget) => {
  const values = [
    budget.danh_mục,
    budget.hạn_mức,
    budget.đã_chi,
    budget.icon
  ];
  
  return updateSheetData('Sheet2', rowIndex, values);
};

// Hàm xóa ngân sách từ Sheet2
export const deleteBudget = async (rowIndex) => {
  return deleteSheetData('Sheet2', rowIndex, 4);
};

// Hàm lấy dữ liệu mục tiêu tài chính từ Sheet3
export const fetchGoals = async () => {
  return fetchSheetData('Sheet3', 'A:E');
};

// Hàm thêm mục tiêu tài chính mới vào Sheet3
export const addGoal = async (goal) => {
  const values = [
    goal.tên_mục_tiêu,
    goal.số_tiền_mục_tiêu,
    goal.số_tiền_hiện_tại,
    goal.ngày_bắt_đầu,
    goal.ngày_kết_thúc
  ];
  
  return addSheetData('Sheet3', 'A:E', values);
};

// Hàm cập nhật mục tiêu tài chính trong Sheet3
export const updateGoal = async (rowIndex, goal) => {
  const values = [
    goal.tên_mục_tiêu,
    goal.số_tiền_mục_tiêu,
    goal.số_tiền_hiện_tại,
    goal.ngày_bắt_đầu,
    goal.ngày_kết_thúc
  ];
  
  return updateSheetData('Sheet3', rowIndex, values);
};

// Hàm xóa mục tiêu tài chính từ Sheet3
export const deleteGoal = async (rowIndex) => {
  return deleteSheetData('Sheet3', rowIndex, 5);
};

// Hàm lấy dữ liệu công việc đã apply từ Sheet4
export const fetchJobs = async () => {
  return fetchSheetData('Sheet4', 'A:G');
};

// Hàm thêm công việc mới vào Sheet4
export const addJob = async (job) => {
  const values = [
    job.ngày_gửi,
    job.tiêu_đề_công_việc,
    job.tên_công_ty,
    job.mức_lương,
    job.địa_điểm,
    job.tên_file_cv,
    job.nguồn
  ];
  
  return addSheetData('Sheet4', 'A:G', values);
};

// Hàm cập nhật công việc trong Sheet4
export const updateJob = async (rowIndex, job) => {
  const values = [
    job.ngày_gửi,
    job.tiêu_đề_công_việc,
    job.tên_công_ty,
    job.mức_lương,
    job.địa_điểm,
    job.tên_file_cv,
    job.nguồn
  ];
  
  return updateSheetData('Sheet4', rowIndex, values);
};

// Hàm xóa công việc từ Sheet4
export const deleteJob = async (rowIndex) => {
  return deleteSheetData('Sheet4', rowIndex, 7);
};
export default {
  fetchTransactions,
  getBanks,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  fetchBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  fetchJobs,
  addJob,
  updateJob,
  deleteJob
};