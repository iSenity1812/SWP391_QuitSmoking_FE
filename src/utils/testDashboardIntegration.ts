// Test file để verify tích hợp API Dashboard Revenue
// File này có thể được sử dụng để test manually hoặc automated testing

import { dashboardService } from "@/services/api/dashboardService"
import { transformRevenueData, calculateDateRange, formatCurrency, generateFallbackData, validateRevenueData } from "@/utils/chartUtils"

export async function testDashboardIntegration() {
  console.log('🚀 Testing Dashboard API Integration (6 months)...')

  try {
    // Test 1: Calculate date range (6 months)
    console.log('\n📅 Test 1: Date Range Calculation (6 months)')
    const dateRange = calculateDateRange()
    console.log('Date Range:', dateRange)

    // Test 2: API call
    console.log('\n📡 Test 2: API Call')
    const apiData = await dashboardService.getRevenueByPeriod({
      groupBy: 'MONTH',
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    })
    console.log('API Response:', apiData)

    // Test 3: Data validation
    console.log('\n✅ Test 3: Data Validation')
    const isValid = validateRevenueData(apiData)
    console.log('Data is valid:', isValid)

    // Test 4: Data transformation
    console.log('\n🔄 Test 4: Data Transformation')
    const chartData = transformRevenueData(apiData)
    console.log('Chart Data:', chartData)
    console.log('Number of months:', chartData.length)

    // Test 5: Fallback data (6 months)
    console.log('\n🔄 Test 5: Fallback Data (6 months)')
    const fallbackData = generateFallbackData()
    console.log('Fallback Data:', fallbackData)
    console.log('Number of fallback months:', fallbackData.length)

    // Test 6: Currency formatting
    console.log('\n💰 Test 6: Currency Formatting')
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)
    const formattedTotal = formatCurrency(totalRevenue)
    console.log('Total Revenue:', formattedTotal)

    console.log('\n✅ All tests passed!')
    return {
      success: true,
      data: {
        dateRange,
        apiData,
        chartData,
        fallbackData,
        totalRevenue: formattedTotal,
        isValid
      }
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function để test từ browser console
if (typeof window !== 'undefined') {
  (globalThis as { testDashboardIntegration?: typeof testDashboardIntegration }).testDashboardIntegration = testDashboardIntegration
}
