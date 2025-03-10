// Các hàm định dạng dữ liệu

export const formatCurrency = (amount) => {
    // Chuyển đổi chuỗi như "30.000 đ" thành số
    if (typeof amount === 'string') {
      return amount.replace(/\./g, '').replace(' đ', '');
    }
    return amount;
  };
  
  export const formatDate = (dateStr) => {
    // Chuyển đổi từ DD/MM/YYYY sang định dạng Date
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };
  
  export const formatNumber = (number) => {
    return number.toLocaleString('vi-VN');
  };
  
  export const formatCurrencyDisplay = (amount) => {
    return `${formatNumber(amount)} đ`;
  };
  
  export const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  export const formatTimeAgo = (dateStr) => {
    const date = formatDate(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hôm nay';
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} tuần trước`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} năm trước`;
    }
  };