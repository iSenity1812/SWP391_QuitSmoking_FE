import type { RevenueByPeriodDTO, ChartDataPoint, DateRange } from "@/types/dashboard";

/**
 * Transform API revenue data to chart format
 * @param apiData - Revenue data from API
 * @param chartPeriod - The chart period type to determine formatting
 * @returns Formatted data for charts
 */
export function transformRevenueData(apiData: RevenueByPeriodDTO[], chartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH'): ChartDataPoint[] {
  if (!apiData || apiData.length === 0) {
    console.warn('No revenue data provided for transformation');
    return generateEmptyPeriodData(chartPeriod); // Return empty data for all periods
  }

  // Generate complete period data with 0 values first
  const completePeriodData = generateEmptyPeriodData(chartPeriod);

  // Create a map from API data for quick lookup
  const apiDataMap = new Map<string, RevenueByPeriodDTO>();
  apiData.forEach(item => {
    apiDataMap.set(item.period, item);
  });

  // Fill in actual data where available
  const filledData = completePeriodData.map(emptyItem => {
    // Extract period from formatted label to match with API data
    const periodKey = getPeriodKeyFromLabel(emptyItem.month, chartPeriod);
    const apiItem = apiDataMap.get(periodKey);

    return {
      month: emptyItem.month,
      revenue: apiItem ? Math.round(apiItem.revenue) : 0
    };
  });

  console.log(`Transformed data for ${chartPeriod} period:`, filledData);
  return filledData;
}

/**
 * Generate empty period data for chart display
 * @param chartPeriod - The chart period type
 * @returns Array of empty data points for the period
 */
export function generateEmptyPeriodData(chartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH'): ChartDataPoint[] {
  const emptyData: ChartDataPoint[] = [];
  const now = new Date();

  switch (chartPeriod) {
    case 'DAY': {
      // Generate 30 days of empty data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        emptyData.push({
          month: formatPeriodLabel(formatDateForAPI(date), 'DAY'),
          revenue: 0
        });
      }
      break;
    }

    case 'WEEK': {
      // Generate 12 weeks of empty data
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        const weekNum = getWeekNumber(date);
        const year = date.getFullYear();
        const currentYear = now.getFullYear();

        emptyData.push({
          month: year !== currentYear ? `T${weekNum}/${year}` : `T${weekNum}`,
          revenue: 0
        });
      }
      break;
    }

    case 'MONTH': {
      // Generate 6 months of empty data including current month
      const currentMonth = now.getMonth(); // 0-indexed
      for (let i = 5; i >= 0; i--) {
        let month = currentMonth - i;
        let year = now.getFullYear();

        if (month < 0) {
          month += 12;
          year -= 1;
        }

        emptyData.push({
          month: year !== now.getFullYear() ? `T${month + 1}/${year}` : `T${month + 1}`,
          revenue: 0
        });
      }
      break;
    }

    case 'YEAR': {
      // Generate 3 years of empty data
      for (let i = 2; i >= 0; i--) {
        const year = now.getFullYear() - i;
        emptyData.push({
          month: year.toString(),
          revenue: 0
        });
      }
      break;
    }
  }

  return emptyData;
}

/**
 * Get period key from formatted label for API lookup
 * @param label - Formatted label (e.g., "T7", "T7/2024")
 * @param chartPeriod - The chart period type
 * @returns API period key (e.g., "2025-07")
 */
export function getPeriodKeyFromLabel(label: string, chartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'): string {
  const now = new Date();
  const currentYear = now.getFullYear();

  switch (chartPeriod) {
    case 'DAY': {
      // Convert "05/07" or "05/07/25" back to "2025-07-05" (day/month format)
      const parts = label.split('/');
      if (parts.length === 2) {
        // "05/07" format - assume current year (day/month)
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        return `${currentYear}-${month}-${day}`;
      } else if (parts.length === 3) {
        // "05/07/25" format (day/month/year)
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parseInt(parts[2], 10);
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        return `${fullYear}-${month}-${day}`;
      }
      break;
    }

    case 'WEEK': {
      // Convert "T1" or "T1/2024" back to week format
      if (label.includes('/')) {
        const parts = label.split('/');
        const week = parts[0].substring(1); // Remove 'T'
        const year = parts[1];
        return `${year}-W${week.padStart(2, '0')}`;
      } else {
        const week = label.substring(1); // Remove 'T'
        return `${currentYear}-W${week.padStart(2, '0')}`;
      }
    }

    case 'MONTH': {
      // Convert "T7" or "T7/2024" back to "2025-07"
      if (label.includes('/')) {
        const parts = label.split('/');
        const month = parts[0].substring(1); // Remove 'T'
        const year = parts[1];
        return `${year}-${month.padStart(2, '0')}`;
      } else {
        const month = label.substring(1); // Remove 'T'
        return `${currentYear}-${month.padStart(2, '0')}`;
      }
    }

    case 'YEAR': {
      // Label should be just the year
      return label;
    }
  }

  return label;
}

/**
 * Format period string for display
 * @param period - Period string from API (e.g., "2025-07", "2025-W01", "2025-01-01")
 * @param chartPeriod - The chart period type to determine formatting
 * @returns Formatted label
 */
export function formatPeriodLabel(period: string, chartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH'): string {
  try {
    switch (chartPeriod) {
      case 'DAY': {
        // Daily format: "2025-01-01" -> "01/01" or "01/01/25"
        if (period.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const date = new Date(period + 'T00:00:00');
          const currentYear = new Date().getFullYear();
          const year = date.getFullYear();
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');

          if (year !== currentYear) {
            const yearShort = String(year).slice(-2);
            return `${day}/${month}/${yearShort}`;
          } else {
            return `${day}/${month}`;
          }
        }
        break;
      }

      case 'WEEK': {
        // Weekly format: "2025-W01" -> "T1/2025" or "2025-01-01" -> "T1"
        if (period.includes('-W')) {
          const parts = period.split('-W');
          const year = parseInt(parts[0], 10);
          const week = parseInt(parts[1], 10);
          const currentYear = new Date().getFullYear();

          if (year !== currentYear) {
            return `T${week}/${year}`;
          } else {
            return `T${week}`;
          }
        }
        // If backend sends date format for weekly, calculate week number
        if (period.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const date = new Date(period + 'T00:00:00');
          const weekNum = getWeekNumber(date);
          const year = date.getFullYear();
          const currentYear = new Date().getFullYear();

          if (year !== currentYear) {
            return `T${weekNum}/${year}`;
          } else {
            return `T${weekNum}`;
          }
        }
        break;
      }

      case 'MONTH': {
        // Monthly format: "2025-07" -> "T7" or "T7/2025"
        if (period.includes('-') && period.length === 7) {
          const parts = period.split('-');
          if (parts.length >= 2) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const currentYear = new Date().getFullYear();

            if (year !== currentYear) {
              return `T${month}/${year}`;
            } else {
              return `T${month}`;
            }
          }
        }
        break;
      }

      case 'YEAR': {
        // Yearly format: "2025" -> "2025"
        if (period.match(/^\d{4}$/)) {
          return period;
        }
        // If format is "2025-01-01", extract year
        if (period.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return period.substring(0, 4);
        }
        break;
      }
    }

    // Fallback: return original if format is unexpected
    console.warn(`Unexpected period format for ${chartPeriod}: ${period}`);
    return period;
  } catch (error) {
    console.error('Error formatting period label:', error);
    return period;
  }
}

/**
 * Get week number of the year
 * @param date - Date object
 * @returns Week number
 */
function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Calculate date range based on chart period type
 * @param chartPeriod - The time period type (DAY, WEEK, MONTH, YEAR)
 * @returns DateRange object with start and end dates
 */
export function calculateDateRange(chartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH'): DateRange {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  let startDate: Date;
  let endDate: Date;

  switch (chartPeriod) {
    case 'DAY': {
      // Last 30 days
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      endDate = new Date(now);
      break;
    }

    case 'WEEK': {
      // Last 12 weeks (about 3 months)
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (12 * 7));
      endDate = new Date(now);
      break;
    }

    case 'MONTH': {
      // Last 6 months including current month
      let startYear = currentYear;
      let startMonth = currentMonth - 5; // 6 months ago

      if (startMonth < 0) {
        startYear -= 1;
        startMonth += 12;
      }

      startDate = new Date(startYear, startMonth, 1);
      endDate = new Date(currentYear, currentMonth + 1, 0); // Last day of current month
      break;
    }

    case 'YEAR': {
      // Last 3 years including current year
      startDate = new Date(currentYear - 2, 0, 1); // January 1st of 3 years ago
      endDate = new Date(currentYear, 11, 31); // December 31st of current year
      break;
    }

    default: {
      // Default to monthly behavior
      startDate = new Date(currentYear, currentMonth - 5, 1);
      endDate = new Date(currentYear, currentMonth + 1, 0);
      break;
    }
  }

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate)
  };
}

/**
 * Format Date object to YYYY-MM-DD string
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate total revenue from chart data
 * @param data - Chart data points
 * @returns Total revenue amount
 */
export function calculateTotalRevenue(data: ChartDataPoint[]): number {
  return data.reduce((sum, item) => sum + item.revenue, 0);
}

/**
 * Format currency for display
 * @param amount - Amount in VND
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Generate fallback data when API fails
 * @param chartPeriod - The chart period type
 * @returns Empty chart data based on period type
 */
export function generateFallbackData(chartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH'): ChartDataPoint[] {
  const fallbackData: ChartDataPoint[] = [];
  const now = new Date();

  switch (chartPeriod) {
    case 'DAY': {
      // Generate 30 days of empty data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        fallbackData.push({
          month: formatPeriodLabel(formatDateForAPI(date), 'DAY'),
          revenue: 0 // Empty data - no fake values
        });
      }
      break;
    }

    case 'WEEK': {
      // Generate 12 weeks of empty data
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        const weekNum = getWeekNumber(date);
        const year = date.getFullYear();
        const currentYear = now.getFullYear();

        fallbackData.push({
          month: year !== currentYear ? `T${weekNum}/${year}` : `T${weekNum}`,
          revenue: 0 // Empty data - no fake values
        });
      }
      break;
    }

    case 'MONTH': {
      // Generate 6 months of empty data including current month
      const currentMonth = now.getMonth(); // 0-indexed
      for (let i = 5; i >= 0; i--) {
        let month = currentMonth - i;
        let year = now.getFullYear();

        if (month < 0) {
          month += 12;
          year -= 1;
        }

        fallbackData.push({
          month: year !== now.getFullYear() ? `T${month + 1}/${year}` : `T${month + 1}`,
          revenue: 0 // Empty data - no fake values
        });
      }
      break;
    }

    case 'YEAR': {
      // Generate 3 years of empty data
      for (let i = 2; i >= 0; i--) {
        const year = now.getFullYear() - i;
        fallbackData.push({
          month: year.toString(),
          revenue: 0 // Empty data - no fake values
        });
      }
      break;
    }
  }

  console.log(`Generated fallback data for ${chartPeriod}:`, fallbackData);
  return fallbackData;

  // UNCOMMENT BELOW FOR DEMO DATA WHEN NEEDED
  /*
  // Generate realistic revenue values based on period
  const generateRevenueValue = (index: number, total: number) => {
    const baseValue = chartPeriod === 'DAY' ? 150000 : 
                     chartPeriod === 'WEEK' ? 800000 : 
                     chartPeriod === 'MONTH' ? 2500000 : 
                     15000000; // YEAR
    
    // Add some variation and growth trend
    const variation = 0.3; // 30% variation
    const growthFactor = 1 + (index / total) * 0.2; // 20% growth over time
    const randomFactor = 1 + (Math.random() - 0.5) * variation;
    
    return Math.round(baseValue * growthFactor * randomFactor);
  };

  switch (chartPeriod) {
    case 'DAY': {
      // Generate 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        fallbackData.push({
          month: formatPeriodLabel(formatDateForAPI(date), 'DAY'),
          revenue: generateRevenueValue(29 - i, 30)
        });
      }
      break;
    }

    case 'WEEK': {
      // Generate 12 weeks of data
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        const weekNum = getWeekNumber(date);
        const year = date.getFullYear();
        const currentYear = now.getFullYear();
        
        fallbackData.push({
          month: year !== currentYear ? `T${weekNum}/${year}` : `T${weekNum}`,
          revenue: generateRevenueValue(11 - i, 12)
        });
      }
      break;
    }

    case 'MONTH': {
      // Generate 6 months of data including current month
      const currentMonth = now.getMonth(); // 0-indexed
      for (let i = 5; i >= 0; i--) {
        let month = currentMonth - i;
        let year = now.getFullYear();
        
        if (month < 0) {
          month += 12;
          year -= 1;
        }

        fallbackData.push({
          month: year !== now.getFullYear() ? `T${month + 1}/${year}` : `T${month + 1}`,
          revenue: generateRevenueValue(5 - i, 6)
        });
      }
      break;
    }

    case 'YEAR': {
      // Generate 3 years of data
      for (let i = 2; i >= 0; i--) {
        const year = now.getFullYear() - i;
        fallbackData.push({
          month: year.toString(),
          revenue: generateRevenueValue(2 - i, 3)
        });
      }
      break;
    }
  }
  */
}

/**
 * Validate API response data
 * @param data - Data to validate
 * @returns True if data is valid
 */
export function validateRevenueData(data: unknown): data is RevenueByPeriodDTO[] {
  if (!Array.isArray(data)) {
    console.error('Revenue data is not an array');
    return false;
  }

  return data.every(item =>
    typeof item === 'object' &&
    item !== null &&
    typeof item.period === 'string' &&
    typeof item.revenue === 'number' &&
    typeof item.transactionCount === 'number'
  );
}
