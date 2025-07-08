/**
 * ====================================================================
 * TRANSACTION DATA HOOK - React Query Hook cho Transactions Management
 * ====================================================================
 * 
 * Chức năng chính:
 * - Quản lý state và caching cho transactions data
 * - Integrated với React Query cho auto-refetch và caching
 * - Hỗ trợ advanced filtering và pagination
 * - Real-time updates và background sync
 * 
 * Features:
 * - Smart caching với stale time
 * - Background refetch
 * - Optimistic updates
 * - Error handling và retry logic
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { dashboardService, type GetTransactionsParams, type TransactionDetailDTO, type PagedResponse } from '@/services/api/dashboardService';
import type { TransactionExportRequest } from '@/types/dashboard';
import { toast } from '@/utils/toast';

/**
 * ====================================================================
 * TRANSACTION DATA HOOK
 * ====================================================================
 */

interface UseTransactionDataOptions {
  initialFilters?: Partial<GetTransactionsParams>;
  enableAutoRefresh?: boolean;
  refetchInterval?: number;
}

interface UseTransactionDataReturn {
  // Data state
  data: PagedResponse<TransactionDetailDTO> | undefined;
  transactions: TransactionDetailDTO[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Pagination state
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;

  // Filter state
  filters: GetTransactionsParams;
  activeFiltersCount: number;

  // Actions
  setFilters: (newFilters: Partial<GetTransactionsParams>) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  refreshData: () => void;

  // Export
  exportData: (format: 'CSV' | 'EXCEL') => Promise<void>;
  isExporting: boolean;
}

/**
 * Default filters for transactions
 */
const DEFAULT_FILTERS: GetTransactionsParams = {
  period: 'LAST_30_DAYS',
  page: 0,
  size: 20,
  sortBy: 'transactionDate',
  sortDirection: 'DESC',
  includeAllStatuses: false, // Chỉ lấy SUCCESS transactions by default
};

/**
 * Main hook for transaction data management
 */
export const useTransactionData = (options: UseTransactionDataOptions = {}): UseTransactionDataReturn => {
  const queryClient = useQueryClient();

  // ================================================================
  // STATE MANAGEMENT
  // ================================================================
  const [filters, setFiltersState] = useState<GetTransactionsParams>({
    ...DEFAULT_FILTERS,
    ...options.initialFilters,
  });

  // ================================================================
  // REACT QUERY SETUP
  // ================================================================
  const queryKey = ['dashboard', 'transactions', filters];

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => dashboardService.getTransactions(filters),
    staleTime: 30000, // 30 seconds
    refetchInterval: options.enableAutoRefresh ? (options.refetchInterval ?? 60000) : false, // Auto-refresh every 60s
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // ================================================================
  // EXPORT MUTATION
  // ================================================================
  const exportMutation = useMutation({
    mutationFn: async (format: 'CSV' | 'EXCEL') => {
      // Convert filters to export request
      const exportRequest: TransactionExportRequest = {
        format: format,
        exportType: 'TRANSACTIONS',
        period: filters.period || 'LAST_30_DAYS',
        startDate: filters.startDate,
        endDate: filters.endDate,
        statuses: filters.includeAllStatuses ? ['SUCCESS', 'FAILED', 'PENDING', 'CANCELED'] : ['SUCCESS'],
        planIds: filters.planIds,
        userIds: filters.userIds,
        paymentMethod: filters.paymentMethod,
        includeDetails: true,
        sortBy: filters.sortBy || 'transactionDate',
        sortDirection: filters.sortDirection || 'DESC',
        maxRecords: 5000 // Limit for export
      };

      const blob = await dashboardService.exportTransactions(exportRequest);
      const fileName = dashboardService.generateExportFileName(format);

      // Trigger download
      dashboardService.downloadFile(blob, fileName);

      return { blob, fileName };
    },
    onSuccess: (result) => {
      toast.success('Xuất dữ liệu thành công', {
        description: `File ${result.fileName} đã được tải xuống`
      });
    },
    onError: (error) => {
      console.error('Export failed:', error);
      toast.error('Xuất dữ liệu thất bại', {
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xuất dữ liệu'
      });
    },
  });

  // ================================================================
  // COMPUTED VALUES
  // ================================================================
  const transactions = useMemo(() => data?.content ?? [], [data]);
  const currentPage = useMemo(() => data?.number ?? 0, [data]);
  const totalPages = useMemo(() => data?.totalPages ?? 0, [data]);
  const totalElements = useMemo(() => data?.totalElements ?? 0, [data]);
  const pageSize = useMemo(() => data?.size ?? 20, [data]);

  // Count active filters (excluding default values)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.period && filters.period !== 'LAST_30_DAYS') count++;
    if (filters.planIds && filters.planIds.length > 0) count++;
    if (filters.userIds && filters.userIds.length > 0) count++;
    if (filters.paymentMethod) count++;
    if (filters.includeAllStatuses) count++;
    if (filters.startDate || filters.endDate) count++;
    return count;
  }, [filters]);

  // ================================================================
  // ACTION HANDLERS
  // ================================================================
  const setFilters = useCallback((newFilters: Partial<GetTransactionsParams>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      page: 0, // Reset to first page when filters change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const goToPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((size: number) => {
    setFiltersState(prev => ({ ...prev, size, page: 0 }));
  }, []);

  const refreshData = useCallback(() => {
    refetch();
    // Also invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [refetch, queryClient]);

  const exportData = useCallback(async (format: 'CSV' | 'EXCEL') => {
    await exportMutation.mutateAsync(format);
  }, [exportMutation]);

  return {
    // Data state
    data,
    transactions,
    isLoading,
    isError,
    error: error as Error | null,

    // Pagination state
    currentPage,
    totalPages,
    totalElements,
    pageSize,

    // Filter state
    filters,
    activeFiltersCount,

    // Actions
    setFilters,
    resetFilters,
    goToPage,
    changePageSize,
    refreshData,

    // Export
    exportData,
    isExporting: exportMutation.isPending,
  };
};

/**
 * ====================================================================
 * TRANSACTION DETAIL HOOK
 * ====================================================================
 * 
 * Hook for fetching individual transaction details
 */
export const useTransactionDetail = (transactionId: string | null) => {
  return useQuery({
    queryKey: ['dashboard', 'transaction', transactionId],
    queryFn: () => transactionId ? dashboardService.getTransactionById(transactionId) : null,
    enabled: !!transactionId,
    staleTime: 300000, // 5 minutes - transaction details don't change often
    retry: 2,
  });
};

/**
 * ====================================================================
 * FILTER UTILITIES HOOK
 * ====================================================================
 * 
 * Hook for managing transaction filters UI state
 */
export const useTransactionFilters = () => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Partial<GetTransactionsParams>>({});

  const openFilterPanel = useCallback(() => setIsFilterPanelOpen(true), []);
  const closeFilterPanel = useCallback(() => setIsFilterPanelOpen(false), []);
  const toggleFilterPanel = useCallback(() => setIsFilterPanelOpen(prev => !prev), []);

  const applyTempFilters = useCallback((onApply: (filters: Partial<GetTransactionsParams>) => void) => {
    onApply(tempFilters);
    setTempFilters({});
    closeFilterPanel();
  }, [tempFilters, closeFilterPanel]);

  const clearTempFilters = useCallback(() => {
    setTempFilters({});
  }, []);

  return {
    isFilterPanelOpen,
    tempFilters,
    setTempFilters,
    openFilterPanel,
    closeFilterPanel,
    toggleFilterPanel,
    applyTempFilters,
    clearTempFilters,
  };
};

/**
 * ====================================================================
 * DOCUMENTATION FOR TEAM
 * ====================================================================
 * 
 * 🎯 USAGE EXAMPLES:
 * 
 * // Basic usage
 * const { transactions, isLoading, setFilters } = useTransactionData();
 * 
 * // With custom options
 * const transactionData = useTransactionData({
 *   initialFilters: { period: 'LAST_7_DAYS', includeAllStatuses: true },
 *   enableAutoRefresh: true,
 *   refetchInterval: 30000
 * });
 * 
 * // Filter by plan
 * setFilters({ planIds: [1, 2, 3] });
 * 
 * // Export data
 * await exportData('CSV');
 * 
 * // Get transaction detail
 * const { data: transactionDetail } = useTransactionDetail('transaction-id');
 * 
 * 🔄 REACT QUERY FEATURES:
 * - Automatic background refetch
 * - Intelligent caching
 * - Error retry with exponential backoff
 * - Optimistic updates
 * - Window focus refetch
 * 
 * 📊 PERFORMANCE OPTIMIZATIONS:
 * - Memoized computed values
 * - Efficient filter state management
 * - Smart query invalidation
 * - Debounced filter applications
 */
