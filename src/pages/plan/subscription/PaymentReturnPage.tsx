import { Card, CardContent } from "@/components/ui/card";
import { vnpayService } from "@/services/vnpayService";
import { Calendar1, CheckCircle, Home, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    orderInfo?: string;
    amount?: number;
    transactionRef?: string;
    paymentDate?: string; // Thêm trường ngày thanh toán
  } | null>(null);

  // Decode và xử lý kết quả thanh toán từ URL
  const decodePaymentResult = (data: string): string => {
    try {
      // Decode uri
      let decodedData = decodeURIComponent(data);
      // Thay thế dấu + thành khoảng trắng
      decodedData = decodedData.replace(/\+/g, ' ');

      //
      decodedData = decodedData.replace(/%3A/g, ':'); // Thay thế %3A thành dấu hai chấm
      decodedData = decodedData.replace(/%2B/g, '+'); // Thay thế %2B thành dấu cộng
      decodedData = decodedData.replace(/%2F/g, '/'); // Thay thế %2F thành dấu gạch chéo
      decodedData = decodedData.replace(/%2D/g, '-'); // Thay thế %2D thành dấu gạch ngang
      decodedData = decodedData.replace(/%3F/g, '?'); // Thay thế %3F thành dấu hỏi

      // Cleanup các ký tự không cần thiết
      decodedData = decodedData.replace(/\s*-\s*OrderRef\s*:\s*[a-f0-9-]+/i, '');
      return decodedData;
    } catch (error) {
      console.error("Lỗi khi decode dữ liệu thanh toán:", error);
      return data; // Trả về dữ liệu gốc nếu có lỗi
    }
  };

  // format date tuwf VNPay (YYYYMMDDHHMMSS) sang định dạng ngày giờ dễ đọc
  const formatPaymentDate = (vnpDate: string): string => {
    if (!vnpDate || vnpDate.length !== 14) return '';

    const year = vnpDate.substring(0, 4);
    const month = vnpDate.substring(4, 6);
    const day = vnpDate.substring(6, 8);
    const hour = vnpDate.substring(8, 10);
    const minute = vnpDate.substring(10, 12);
    const second = vnpDate.substring(12, 14);

    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Hiển thị giờ 24h
    });
  };

  // processPaymentReturn này giờ không cần async/await cho Axios nữa
  const processPaymentReturn = () => {
    setLoading(true);
    try {
      // Gọi hàm mới để đọc thông tin từ URL
      const data = vnpayService.getPaymentReturnFromUrl();

      if (!data) {
        throw new Error("Không thể đọc thông tin thanh toán từ URL.");
      }

      const isSuccess = data.status === 'success'; // Dựa vào trường 'status' mới từ backend

      console.log('Payment processing result:', {
        responseCode: data.vnp_ResponseCode,
        transactionStatus: data.vnp_TransactionStatus,
        isSuccess: isSuccess,
        message: data.message, // Log thêm message từ backend
        urlParamsData: data // Log toàn bộ data đọc được
      });

      // let decodedOrderInfo = data.vnp_OrderInfo;
      // try {
      //   decodedOrderInfo = decodeURIComponent(data.vnp_OrderInfo);
      //   decodedOrderInfo = decodedOrderInfo.replace(/\+/g, ' ');
      // } catch (e) {
      //   console.log('Could not decode order info:', e);
      // }

      const decodedOrderInfo = decodePaymentResult(data.vnp_OrderInfo);
      const formattedPayDate = formatPaymentDate(data.vnp_PayDate);

      setPaymentResult({
        success: isSuccess,
        message: data.message, // Sử dụng message từ backend
        orderInfo: decodedOrderInfo,
        amount: data.vnp_Amount * 100,
        transactionRef: data.vnp_TxnRef,
        paymentDate: formattedPayDate, // Thêm ngày thanh toán đã định dạng
      });

      if (isSuccess) {
        toast.success("Thanh toán thành công! Giờ bạn có thể sử dụng các tính năng Premium.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(`Thanh toán thất bại: ${data.message || 'Lỗi không xác định'}. Vui lòng thử lại sau.`, { // Hiển thị message từ backend
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/subscription");
        }, 5000);
      }
    } catch (error: unknown) {
      console.error("Lỗi khi xử lý kết quả thanh toán:", error);
      setPaymentResult({
        success: false,
        message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý kết quả thanh toán."
      });

      toast.error("Đã xảy ra lỗi khi xử lý kết quả thanh toán. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/subscription");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm xử lý khi component mount
  useEffect(() => {
    processPaymentReturn();
  }, []);

  const handleGoHome = () => {
    navigate("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-slate-600 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="flex flex-col items-center justify-center y-8">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Đang xử lý thanh toán...</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Vui lòng đợi trong giây lát, chúng tôi đang xác nhận kết quả thanh toán của bạn.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-600 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md p-6 mt-8 shadow-lg bg-white dark:bg-slate-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md p-6 shadow-lg bg-white dark:bg-slate-800">
          {/* Thanh cong / thất bại */}
          <div className={`${paymentResult?.success ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-pink-50'} p-6 text-center`}>
            <div className="flex justify-center mb-4">
              {
                paymentResult?.success ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <XCircle className="w-10 h-10 text-red-600" />
                  </motion.div>
                )
              }
            </div>

            <h1 className={`text-2xl font-bold mb-2 ${paymentResult?.success ? 'text-green-800' : 'text-red-800'} dark:text-white mb-2`}>
              {paymentResult?.success ? "Thanh toán thành công!" : "Thanh toán thất bại"}
            </h1>

            {
              paymentResult?.success && (
                <p className="text-green-600 text-sm">
                  Giao dịch VNPay thành công
                </p>
              )
            }
          </div>

          {/* Payment detail */}
          {
            paymentResult?.success && (
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 gap-16">
                  <span className="text-gray-600 text-sm">Mã order</span>
                  <span className="text-gray-800 dark:text-white font-mono text-sm">
                    {paymentResult.transactionRef}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-gray-600 text-sm">Số tiền</span>
                  <span className="text-gray-800 dark:text-white font-mono text-sm">
                    {paymentResult.amount?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-gray-600 text-sm">Loại thanh toán</span>
                  <span className="text-gray-800 dark:text-white font-mono text-sm">VNPAY</span>
                </div>

                {
                  paymentResult.paymentDate && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-gray-600 text-sm">Ngày thanh toán</span>
                      <span className="text-gray-800 dark:text-white font-mono text-sm">
                        {paymentResult.paymentDate}
                      </span>
                    </div>
                  )
                }

                {
                  paymentResult.orderInfo && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-gray-600 text-sm">Thông tin đơn hàng</span>
                      <span className="text-gray-800 dark:text-white font-mono text-sm">
                        {paymentResult.orderInfo}
                      </span>
                    </div>
                  )
                }
              </CardContent>
            )
          }

          {/* Error detail */}
          {
            !paymentResult?.success && (
              <CardContent className="p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 p-4 rounded-lg text-center">
                  <p className="text-red-800 font-medium mb-2">
                    {paymentResult?.orderInfo || "Thanh toán không thành công. Vui lòng thử lại sau."}
                  </p>
                </div>
              </CardContent>
            )
          }

          {/* Active button */}
          <div className="p-6 pt-0 space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>

            {
              paymentResult?.success && (
                <Button
                  // history payment sẽ thay sau
                  onClick={() => navigate("/plan")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  <Calendar1 className="w-4 h-4 mr-2" />
                  Xem lịch sử thanh toán
                </Button>
              )
            }
          </div>

          {/* auto redirect */}
          {/* <div className="px-6 pb-6">
            <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                <Clock className="inline w-4 h-4 mr-1" />
                {paymentResult?.success
                  ? "Bạn sẽ được chuyển hướng về trang chủ trong 5 giây."
                  : "Bạn sẽ được chuyển hướng về trang gói trả phí trong 5 giây."
                }
              </p>
            </div>
          </div> */}
        </Card>
      </motion.div>
    </div>
  )
}