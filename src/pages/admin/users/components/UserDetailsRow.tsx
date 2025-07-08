import React from 'react';
import { adminService, type SubscriptionInfo, type QuitPlanInfo } from '@/services/api/adminService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Calendar, Target, Cigarette, DollarSign, Package } from 'lucide-react';

interface UserDetailsRowProps {
  subscriptions: SubscriptionInfo[];
  quitPlans: QuitPlanInfo[];
  onQuitPlanDeleted: (planId: number) => void;
}

const UserDetailsRow: React.FC<UserDetailsRowProps> = ({
  subscriptions,
  quitPlans,
  onQuitPlanDeleted
}) => {
  const handleDeleteQuitPlan = async (planId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kế hoạch này không? Hành động này không thể hoàn tác.')) {
      try {
        await adminService.deleteQuitPlan(planId);
        onQuitPlanDeleted(planId);
        alert('Xóa kế hoạch thành công!');
      } catch (err) {
        console.error('Failed to delete quit plan:', err);
        alert('Xóa kế hoạch thất bại. Vui lòng thử lại.');
      }
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';

    // Handle special case for goalDate = "2999-12-31" (no end date)
    if (dateString === '2999-12-31') return 'N/A';

    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <td colSpan={8} className="p-0">
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription Details */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Package className="w-5 h-5" />
              Thông tin gói Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptions.length > 0 ? (
              subscriptions.map(sub => (
                <div key={sub.subscriptionId} className="space-y-2 text-sm">
                  <p><strong>Trạng thái:</strong> <Badge variant={sub.status === 'ACTIVE' ? 'default' : 'secondary'}>{sub.status}</Badge></p>
                  <p><strong>Tên gói:</strong> {sub.packageName}</p>
                  <p><strong>Ngày bắt đầu:</strong> {formatDate(sub.startDate)}</p>
                  <p><strong>Ngày kết thúc:</strong> {formatDate(sub.endDate)}</p>
                  <p><strong>Giá:</strong> {formatCurrency(sub.price)}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">
                <p>Không có gói Premium.</p>
                <Badge variant="outline" className="mt-2">Normal Member</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quit Plan Details */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-600 dark:text-green-400">
              <Target className="w-5 h-5" />
              Thông tin kế hoạch bỏ thuốc
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quitPlans.length > 0 ? (
              quitPlans.map(plan => (
                <div key={plan.quitPlanId} className="space-y-2 text-sm relative group">
                  <p><strong>Trạng thái:</strong> <Badge variant={plan.status === 'ACTIVE' || plan.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>{plan.status}</Badge></p>
                  <p><Calendar className="inline w-4 h-4 mr-1" /> <strong>Ngày bắt đầu:</strong> {formatDate(plan.startDate)}</p>
                  <p><Target className="inline w-4 h-4 mr-1" /> <strong>Ngày kết thúc:</strong> {formatDate(plan.goalDate)}</p>
                  <p><Cigarette className="inline w-4 h-4 mr-1" /> <strong>Số điếu ban đầu:</strong> {plan.initialSmokingAmount}</p>
                  <p><DollarSign className="inline w-4 h-4 mr-1" /> <strong>Chi phí/gói:</strong> {formatCurrency(plan.pricePerPack)}</p>
                  <p><Package className="inline w-4 h-4 mr-1" /> <strong>Điếu/gói:</strong> {plan.cigarettesPerPack}</p>
                  <p><strong>Loại giảm:</strong> {plan.reductionType}</p>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteQuitPlan(plan.quitPlanId)}
                    title="Xóa kế hoạch này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Không có dữ liệu về kế hoạch bỏ thuốc.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </td>
  );
};

export default UserDetailsRow;
