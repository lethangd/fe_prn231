import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Client } from "../api-client";
import alertify from "alertifyjs";
import "./VNPayReturn.css";

function VNPayReturn() {
  const [status, setStatus] = useState('processing');
  const [orderInfo, setOrderInfo] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const apiClient = new Client();

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Lấy tất cả các query parameters từ URL
        const queryParams = new URLSearchParams(location.search);
        const vnpResponseCode = queryParams.get('vnp_ResponseCode');
        const orderId = queryParams.get('vnp_TxnRef');
        const amount = queryParams.get('vnp_Amount');
        
        // Xác định trạng thái thanh toán
        const paymentStatus = vnpResponseCode === "00" ? "Success" : "Failed";
        
        // Cập nhật trạng thái thanh toán
        try {
          const updateResponse = await fetch('https://localhost:7097/api/Payment/update-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
              orderId: orderId,
              status: paymentStatus,
              amount: parseFloat(amount) / 100, // VNPay trả về số tiền * 100
              updatedAt: new Date().toISOString()
            })
          });

          if (!updateResponse.ok) {
            console.error('Failed to update payment status');
          }
        } catch (error) {
          console.error('Error updating payment status:', error);
        }

        // Xử lý kết quả thanh toán
        if (vnpResponseCode === "00") {
          setStatus('success');
          setOrderInfo({
            orderId: orderId,
            amount: parseFloat(amount) / 100
          });
          alertify.success("Thanh toán thành công!");
        } else {
          setStatus('failed');
          alertify.error("Thanh toán thất bại!");
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
        setStatus('failed');
        alertify.error("Có lỗi xảy ra khi xử lý thanh toán!");
      }
    };

    processPaymentResult();
  }, [location]);

  const handleContinueShopping = () => {
    history.push('/');
  };

  const handleViewOrder = () => {
    history.push('/history');
  };

  return (
    <div className="vnpay-return-container">
      <div className="vnpay-return-card">
        {status === 'processing' && (
          <div className="processing">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang xử lý...</span>
            </div>
            <h2>Đang xử lý kết quả thanh toán...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="success">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng.</p>
            {orderInfo && (
              <div className="order-info">
                <p>Mã đơn hàng: {orderInfo.orderId}</p>
                <p>Số tiền: {orderInfo.amount} VND</p>
              </div>
            )}
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={handleViewOrder}
              >
                Xem đơn hàng
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={handleContinueShopping}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="failed">
            <div className="failed-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <h2>Thanh toán thất bại!</h2>
            <p>Đã có lỗi xảy ra trong quá trình thanh toán.</p>
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => history.push('/checkout')}
              >
                Thử lại
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={handleContinueShopping}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VNPayReturn; 