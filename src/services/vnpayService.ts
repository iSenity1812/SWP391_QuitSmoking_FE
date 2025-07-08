import axiosConfig from "@/config/axiosConfig";
import { isAxiosError } from "axios";
import { authService } from "./authService";

export interface CreatePaymentRequest {
  amount: number
  orderInfo: string
  orderType: string
  bankCode: string
  planId: number
}

export interface CreatePaymentResponse {
  status: number
  message: string
  data: {
    code: string
    message: string
    paymentUrl: string
  }
  error: object
  errorCode: string
  timestamp: string
}

export interface PaymentReturnResponse {
  status: number
  message: string
  data: {
    vnp_ResponseCode: string
    vnp_TxnRef: string
    vnp_Amount: number
    vnp_OrderInfo: string
    vnp_PayDate: string
    vnp_TransactionStatus: string
    message: string
  }
  error: object
  errorCode: string
  timestamp: string
}

export interface PaymentReturnResponseData {
  vnp_ResponseCode: string;
  vnp_TxnRef: string;
  vnp_Amount: number; // Đảm bảo số tiền được chuyển đổi đúng
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_TransactionStatus: string;
  message: string;
  status: 'success' | 'failed' | 'error'; // Thêm trường status tổng quát từ backend
}

class VNPayService {
  private static instance: VNPayService;

  public static getInstance(): VNPayService {
    if (!VNPayService.instance) {
      VNPayService.instance = new VNPayService();
    }
    return VNPayService.instance;
  }

  // Tạo yêu cầu thanh toán VNPay
  async createPayment(req: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Bạn cần đăng nhập để thực hiện thanh toán');
      console.log('Tạo yêu cầu thanh toán VNPay với dữ liệu:', req);

      const response = await axiosConfig.post<CreatePaymentResponse>('/vnpay/create-payment', req);
      console.log('Phản hồi từ VNPay:', response.data);

      if (response.data.status === 200 && response.data.data) return response.data;
      else throw new Error(response.data.message || 'Không thể tạo yêu cầu thanh toán');
    } catch (error: unknown) {
      console.error('Lỗi khi tạo yêu cầu thanh toán VNPay:', error);
      if (isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
        } else if (error.response?.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thanh toán này')
        } else if (error.response?.status === 400) {
          throw new Error('Yêu cầu thanh toán không hợp lệ. Vui lòng kiểm tra lại thông tin')
        } else {
          throw new Error('Lỗi không xác định khi tạo yêu cầu thanh toán');
        }
      }

      // Nếu không phải lỗi Axios, có thể là lỗi mạng hoặc lỗi khác
      if (error instanceof Error) {
        throw new Error(`Lỗi không xác định: ${error.message}`);
      }
      throw new Error('Lỗi không xác định khi tạo yêu cầu thanh toán');
    }
  }

  // Xử lý phản hồi từ VNPay sau khi thanh toán
  async getPaymentReturn(): Promise<PaymentReturnResponse> {
    try {
      const response = await axiosConfig.get<PaymentReturnResponse>('/vnpay/payment-return');
      console.log('Phản hồi từ VNPay sau thanh toán:', response.data);

      if (response.data.status === 200 && response.data.data) {
        // Nếu thanh toán thành công, refresh user info để cập nhật role
        if (response.data.data.vnp_ResponseCode === '00') {
          console.log('Payment successful, refreshing user info...');
          try {
            await authService.refreshUserInfo();
            console.log('User info refreshed successfully');
          } catch (error) {
            console.error('Failed to refresh user info after payment:', error);
          }
        }
        return response.data;
      } else {
        throw new Error(response.data.message || 'Không thể xử lý phản hồi thanh toán');
      }
    } catch (error: unknown) {
      console.error('Lỗi khi xử lý phản hồi thanh toán VNPay:', error);
      if (isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
        } else if (error.response?.status === 403) {
          throw new Error('Bạn không có quyền truy cập vào thông tin thanh toán này')
        } else if (error.response?.status === 400) {
          throw new Error('Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin')
        } else {
          throw new Error('Lỗi không xác định khi xử lý phản hồi thanh toán');
        }
      }

      // Nếu không phải lỗi Axios, có thể là lỗi mạng hoặc lỗi khác
      if (error instanceof Error) {
        throw new Error(`Lỗi không xác định: ${error.message}`);
      }
      throw new Error('Lỗi không xác định khi xử lý phản hồi thanh toán');
    }
  }


  getPaymentReturnFromUrl(): PaymentReturnResponseData | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      const responseCode = urlParams.get('vnp_ResponseCode') || '';
      const txnRef = urlParams.get('vnp_TxnRef') || '';
      const amountStr = urlParams.get('vnp_Amount');
      const orderInfo = urlParams.get('vnp_OrderInfo') || '';
      const payDate = urlParams.get('vnp_PayDate') || '';
      const transactionStatus = urlParams.get('vnp_TransactionStatus') || '';
      const message = urlParams.get('message') || 'Không có thông báo';
      const status = (urlParams.get('status') as 'success' | 'failed' | 'error') || 'failed'; // Lấy status tổng quát

      const amount = amountStr ? parseFloat(amountStr) / 100 : 0; // Chuyển đổi lại về VND nếu backend gửi là cents

      console.log('Parameters parsed from URL:', {
        responseCode, txnRef, amount, orderInfo, payDate, transactionStatus, message, status
      });

      // Nếu thanh toán thành công, refresh user info
      if (responseCode === '00' || status === 'success') {
        console.log('Payment successful detected from URL, refreshing user info...');
        // Sử dụng setTimeout để không block return
        setTimeout(async () => {
          try {
            await authService.refreshUserInfo();
            console.log('User info refreshed successfully from URL method');
            // Trigger custom event để notify các component khác
            window.dispatchEvent(new CustomEvent('userInfoUpdated'));
          } catch (error) {
            console.error('Failed to refresh user info after payment (URL method):', error);
          }
        }, 100);
      }

      // Bạn có thể trả về một đối tượng chứa tất cả thông tin
      return {
        vnp_ResponseCode: responseCode,
        vnp_TxnRef: txnRef,
        vnp_Amount: amount,
        vnp_OrderInfo: orderInfo,
        vnp_PayDate: payDate,
        vnp_TransactionStatus: transactionStatus,
        message: message,
        status: status,
      };

    } catch (error) {
      console.error('Lỗi khi đọc tham số từ URL:', error);
      return null;
    }
  }
}

export const vnpayService = VNPayService.getInstance();