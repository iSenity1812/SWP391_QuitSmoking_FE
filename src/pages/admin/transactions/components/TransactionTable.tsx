/**
 * ====================================================================
 * TRANSACTION TABLE COMPONENT
 * ====================================================================
 * 
 * Advanced table component for displaying transactions with:
 * - Real-time data với React Query
 * - Advanced filtering và search
 * - Sorting và pagination
 * - Export functionality
 * - Transaction detail modal
 * - Responsive design
 */

"use client"

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  Settings,
  Users,
  Calendar,
  CreditCard,
  DollarSign
} from 'lucide-react';

import { useTransactionData, useTransactionDetail } from '@/hooks/useTransactionData';
import { formatCurrency } from '@/utils/chartUtils';
import type { TransactionDetailDTO, TransactionStatus, GetTransactionsParams } from '@/services/api/dashboardService';

/**
 * ====================================================================
 * COMPONENT INTERFACES
 * ====================================================================
 */

interface TransactionTableProps {
  className?: string;
  enableAutoRefresh?: boolean;
  initialFilters?: Partial<GetTransactionsParams>;
  title?: string;
  description?: string;
}

interface TransactionRowProps {
  transaction: TransactionDetailDTO;
  onViewDetail: (transactionId: string) => void;
}

/**
 * ====================================================================
 * UTILITY FUNCTIONS
 * ====================================================================
 */

/**
 * Get status badge variant based on transaction status
 */
const getStatusBadgeVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'SUCCESS':
      return 'default'; // Green
    case 'PENDING':
      return 'secondary'; // Yellow
    case 'FAILED':
    case 'CANCELED':
      return 'destructive'; // Red
    default:
      return 'outline';
  }
};

/**
 * Get status display text in Vietnamese
 */
const getStatusDisplayText = (status: TransactionStatus): string => {
  switch (status) {
    case 'SUCCESS':
      return 'Thành công';
    case 'PENDING':
      return 'Đang xử lý';
    case 'FAILED':
      return 'Thất bại';
    case 'CANCELED':
      return 'Đã hủy';
    default:
      return status;
  }
};

/**
 * Format date to Vietnamese locale
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * ====================================================================
 * TRANSACTION ROW COMPONENT
 * ====================================================================
 */
const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, onViewDetail }) => {
  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
      {/* Transaction Date */}
      <TableCell className="font-mono text-sm">
        {formatDate(transaction.transactionDate)}
      </TableCell>

      {/* Transaction ID */}
      <TableCell className="font-mono text-xs max-w-[120px]">
        <div className="truncate" title={transaction.transactionId}>
          {transaction.transactionId.slice(0, 8)}...
        </div>
      </TableCell>

      {/* User Info */}
      <TableCell>
        <div className="flex flex-col space-y-1">
          <div className="font-medium text-sm">{transaction.username}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
            {transaction.userEmail}
          </div>
        </div>
      </TableCell>

      {/* Plan Info */}
      <TableCell>
        <div className="flex flex-col space-y-1">
          <div className="font-medium text-sm">{transaction.planDisplayName}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {formatCurrency(transaction.planPrice)}
          </div>
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right font-semibold">
        {formatCurrency(transaction.amount)}
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={getStatusBadgeVariant(transaction.status)}>
          {getStatusDisplayText(transaction.status)}
        </Badge>
      </TableCell>

      {/* Payment Method */}
      <TableCell>
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{transaction.paymentMethod}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetail(transaction.transactionId)}>
              <Eye className="w-4 h-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Tải hóa đơn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

/**
 * ====================================================================
 * TRANSACTION DETAIL MODAL
 * ====================================================================
 */
interface TransactionDetailModalProps {
  transactionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transactionId,
  isOpen,
  onClose
}) => {
  const { data: transaction, isLoading, isError } = useTransactionDetail(transactionId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về giao dịch và người dùng
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>Không thể tải chi tiết giao dịch</span>
          </div>
        )}

        {transaction && (
          <div className="space-y-6">
            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID Giao dịch
                </label>
                <p className="mt-1 font-mono text-sm">{transaction.transactionId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trạng thái
                </label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>
                    {getStatusDisplayText(transaction.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Số tiền
                </label>
                <p className="mt-1 font-semibold text-lg">{formatCurrency(transaction.amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phương thức thanh toán
                </label>
                <p className="mt-1">{transaction.paymentMethod}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thời gian giao dịch
                </label>
                <p className="mt-1">{formatDate(transaction.transactionDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID giao dịch ngoài
                </label>
                <p className="mt-1 font-mono text-sm">{transaction.externalTransactionId}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Thông tin người dùng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tên người dùng
                  </label>
                  <p className="mt-1">{transaction.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <p className="mt-1">{transaction.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vai trò
                  </label>
                  <p className="mt-1">{transaction.userRole}</p>
                </div>
              </div>
            </div>

            {/* Plan Info */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Thông tin gói</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tên gói
                  </label>
                  <p className="mt-1">{transaction.planDisplayName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Giá gói
                  </label>
                  <p className="mt-1 font-semibold">{formatCurrency(transaction.planPrice)}</p>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            {transaction.subscriptionId && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Thông tin subscription</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ID Subscription
                    </label>
                    <p className="mt-1">{transaction.subscriptionId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Trạng thái
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={transaction.isSubscriptionActive ? 'default' : 'secondary'}
                        className={transaction.isSubscriptionActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}
                      >
                        {transaction.isSubscriptionActive ? 'Đang hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </div>
                  </div>
                  {transaction.subscriptionStartDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ngày bắt đầu
                      </label>
                      <p className="mt-1">{formatDate(transaction.subscriptionStartDate)}</p>
                    </div>
                  )}
                  {transaction.subscriptionEndDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ngày kết thúc
                      </label>
                      <p className="mt-1">{formatDate(transaction.subscriptionEndDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * ====================================================================
 * MAIN TRANSACTION TABLE COMPONENT
 * ====================================================================
 */
export const TransactionTable: React.FC<TransactionTableProps> = ({
  className,
  enableAutoRefresh = true,
  initialFilters,
  title = "Quản lý giao dịch",
  description = "Danh sách các giao dịch với thông tin chi tiết"
}) => {
  // ================================================================
  // HOOKS & STATE
  // ================================================================
  const {
    transactions,
    isLoading,
    isError,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    filters,
    activeFiltersCount,
    setFilters,
    resetFilters,
    goToPage,
    changePageSize,
    refreshData,
    exportData,
    isExporting
  } = useTransactionData({
    initialFilters,
    enableAutoRefresh,
    refetchInterval: 60000, // 1 minute
  });

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ================================================================
  // EVENT HANDLERS
  // ================================================================
  const handleViewDetail = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTransactionId(null);
  };

  const handleExport = async (format: 'CSV' | 'EXCEL') => {
    try {
      await exportData(format);
    } catch (error) {
      console.error('Export failed:', error);
      // Add toast notification here
    }
  };

  const handleSort = (field: string) => {
    const newDirection = filters.sortBy === field && filters.sortDirection === 'DESC' ? 'ASC' : 'DESC';
    setFilters({
      sortBy: field,
      sortDirection: newDirection,
    });
  };

  // ================================================================
  // PAGINATION CONTROLS
  // ================================================================
  const paginationInfo = useMemo(() => {
    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalElements);
    return `${start}-${end} trong ${totalElements} giao dịch`;
  }, [currentPage, pageSize, totalElements]);

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className={className}>
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>{title}</span>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </CardTitle>
              <CardDescription>
                {description} • {paginationInfo}
              </CardDescription>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Filter button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Open filter panel */ }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Export button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isExporting}>
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Xuất dữ liệu
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Định dạng</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('CSV')}>
                    Xuất CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('EXCEL')}>
                    Xuất Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Refresh button */}
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Error State */}
          {isError && (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>Lỗi: {error?.message || 'Không thể tải dữ liệu'}</span>
              <Button variant="outline" size="sm" className="ml-4" onClick={refreshData}>
                Thử lại
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Đang tải dữ liệu...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Không có giao dịch
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                Không tìm thấy giao dịch nào với bộ lọc hiện tại.
                Thử điều chỉnh bộ lọc hoặc thay đổi khoảng thời gian.
              </p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && transactions.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('transactionDate')}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Thời gian
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                      </Button>
                    </TableHead>
                    <TableHead>ID Giao dịch</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Gói</TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('amount')}>
                        Số tiền
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                      </Button>
                    </TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.transactionId}
                      transaction={transaction}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {pageSize} <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[10, 20, 50, 100].map((size) => (
                      <DropdownMenuItem key={size} onClick={() => changePageSize(size)}>
                        {size} mục
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  mục mỗi trang
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Trước
                </Button>

                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Trang {currentPage + 1} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transactionId={selectedTransactionId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default TransactionTable;
