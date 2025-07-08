/**
 * ====================================================================
 * TRANSACTION DETAIL MODAL - Modal hiển thị chi tiết giao dịch
 * ====================================================================
 * 
 * Features:
 * - Hiển thị đầy đủ thông tin giao dịch
 * - Responsive design
 * - Copy transaction ID
 * - Print/Export transaction
 * - Refund action (if applicable)
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  CreditCard,
  Calendar,
  DollarSign,
  Copy,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { formatCurrency, formatDate, formatId } from "@/utils/formatters";
import type { TransactionDetailDTO, TransactionStatus } from "@/services/api/dashboardService";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/api/dashboardService";

interface TransactionDetailModalProps {
  transactionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Component hiển thị chi tiết giao dịch trong modal
 */
export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transactionId,
  isOpen,
  onClose
}) => {
  // Fetch transaction detail
  const {
    data: transaction,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => transactionId ? dashboardService.getTransactionById(transactionId) : null,
    enabled: !!transactionId && isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'CANCELED':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return 'default';
      case 'FAILED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      case 'CANCELED':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusDisplayText = (status: TransactionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return 'Thành công';
      case 'FAILED':
        return 'Thất bại';
      case 'PENDING':
        return 'Đang xử lý';
      case 'CANCELED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const copyTransactionId = () => {
    if (transaction?.transactionId) {
      navigator.clipboard.writeText(transaction.transactionId);
      // TODO: Show toast notification
    }
  };

  const printTransaction = () => {
    if (transaction) {
      // TODO: Implement print functionality
      console.log('Print transaction:', transaction.transactionId);
    }
  };

  // =====================================================
  // RENDER HELPERS
  // =====================================================
  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-2">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-lg">Đang tải thông tin...</span>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-800">Có lỗi xảy ra</h3>
        <p className="text-sm text-gray-600 mt-1">
          {error?.message || 'Không thể tải thông tin giao dịch'}
        </p>
      </div>
      <Button onClick={() => refetch()} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Thử lại
      </Button>
    </div>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Chi tiết giao dịch</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading && renderLoadingState()}
        {error && renderErrorState()}

        {transaction && (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">ID:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {formatId(transaction.transactionId, 12)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyTransactionId}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span>{getStatusDisplayText(transaction.status)}</span>
                    </div>
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={printTransaction}>
                  <FileText className="w-4 h-4 mr-2" />
                  In
                </Button>
              </div>
            </div>

            <Separator />

            {/* Transaction Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span>Thông tin thanh toán</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Số tiền:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Đơn vị:</span>
                    <span className="text-sm">VND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Phương thức:</span>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{transaction.paymentMethod}</span>
                    </div>
                  </div>
                  {/* Removed payment details, notes, failure reason, and refund info as they're not in the current DTO */}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Thông tin khách hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Tên:</span>
                    <span className="text-sm font-medium">{transaction.username}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="text-sm">{transaction.userEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <span className="text-sm font-mono">{formatId(transaction.userId)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Thông tin gói dịch vụ</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">Tên gói:</span>
                  <span className="text-sm font-medium text-right">{transaction.planName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500">Mô tả:</span>
                  <span className="text-sm text-right max-w-xs">{transaction.planDisplayName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">ID gói:</span>
                  <span className="text-sm font-mono">{transaction.planId}</span>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span>Lịch sử giao dịch</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Ngày giao dịch:</span>
                  <span className="text-sm">{formatDate(transaction.transactionDate, true)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                  <span className="text-sm">{formatDate(transaction.createdAt, true)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Cập nhật cuối:</span>
                  <span className="text-sm">{formatDate(transaction.updatedAt, true)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information */}
            {transaction.subscriptionId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>Thông tin đăng ký</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">ID đăng ký:</span>
                    <span className="text-sm font-mono">{transaction.subscriptionId}</span>
                  </div>
                  {transaction.subscriptionStartDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Ngày bắt đầu:</span>
                      <span className="text-sm">{formatDate(transaction.subscriptionStartDate)}</span>
                    </div>
                  )}
                  {transaction.subscriptionEndDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Ngày kết thúc:</span>
                      <span className="text-sm">{formatDate(transaction.subscriptionEndDate)}</span>
                    </div>
                  )}
                  {transaction.isSubscriptionActive !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                      <Badge
                        variant={transaction.isSubscriptionActive ? 'default' : 'outline'}
                        className={transaction.isSubscriptionActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
                      >
                        {transaction.isSubscriptionActive ? 'Đang hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              {transaction.status === 'SUCCESS' && (
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  Hoàn tiền
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
