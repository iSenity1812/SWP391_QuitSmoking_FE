/**
 * ====================================================================
 * FORMATTERS UTILITY - Các hàm format dữ liệu
 * ====================================================================
 * 
 * Tập hợp các hàm utility để format dữ liệu hiển thị
 * - Format currency (VND)
 * - Format date/time
 * - Format numbers
 * - Format status text
 */

/**
 * Format currency to Vietnamese dong
 * @param amount - Amount to format
 * @param showSymbol - Whether to show ₫ symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
  if (isNaN(amount)) return '0';

  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return showSymbol ? `${formatted} ₫` : formatted;
};

/**
 * Format date to Vietnamese format
 * @param date - Date string or Date object
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }

  return new Intl.DateTimeFormat('vi-VN', options).format(dateObj);
};

/**
 * Format relative time (e.g., "2 giờ trước")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return 'Vừa xong';
};

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0';

  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Format percentage
 * @param value - Value to format as percentage
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (isNaN(value)) return '0%';

  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format duration in milliseconds to human readable format
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format phone number (Vietnamese format)
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as Vietnamese phone number
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return `+84 ${cleaned.substring(2, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
  }

  return phone; // Return original if format not recognized
};

/**
 * Format ID (transaction ID, user ID, etc.)
 * @param id - ID string
 * @param maxLength - Maximum length to show
 * @returns Formatted ID
 */
export const formatId = (id: string, maxLength: number = 8): string => {
  if (!id) return '';

  if (id.length <= maxLength) return id;

  return `${id.substring(0, maxLength)}...`;
};
