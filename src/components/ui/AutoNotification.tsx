import { useEffect } from "react";
import axios from "../../config/axiosConfig";
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";

const VAPID_KEY = "BHzIniQM8sFQ9SyhSBFswrNroTVnTQHSae_dY4W7FP782YZn0A-9GKzl3gTV5mBSsq_h5WDFDRCHDVnYVKLy52U";

export default function AutoNotification() {
  useEffect(() => {
    const sendNotification = async () => {
      const jwt = localStorage.getItem("jwt_token");
      const user = localStorage.getItem("user_info");
      let userId = localStorage.getItem("userId");
      // Polling: chờ userId xuất hiện (tối đa 2s)
      let tries = 0;
      while (!userId && tries < 20) {
        await new Promise(res => setTimeout(res, 100));
        userId = localStorage.getItem("userId");
        tries++;
      }
      if (!jwt || !user || !userId) {
        console.warn("Chưa có JWT, user_info hoặc userId, không gửi notification.");
        return;
      }
      let fcmToken = null;
      try {
        fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      } catch (err) {
        console.error("Lấy FCM token thất bại", err);
        return;
      }
      if (!fcmToken) return;
      const data = {
        notification: {
          title: "Test Notification",
          content: "Thông báo tự động từ FE sau khi login!",
          type: "INFO"
        },
        fcmToken
      };
      try {
        await axios.post("/api/notification", data, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        console.log("Đã gửi notification tự động!");
      } catch (err) {
        console.error("Gửi notification tự động thất bại", err);
      }
    };
    sendNotification();
  }, []);
  return null;
} 