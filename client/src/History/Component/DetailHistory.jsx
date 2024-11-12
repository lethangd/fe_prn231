// components/DetailHistory.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "../../api-client";
import convertMoney from "../../convertMoney";

function DetailHistory() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = new Client();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("You need to log in to view order details.");
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.orderGET2(Number(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderDetails(response);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Chi tiết đơn hàng</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Thông tin đơn hàng */}
      <div className="p-5">
        <div className="row">
          <div className="col-lg-6">
            <h2 className="h4 text-uppercase mb-4">Thông tin đơn hàng</h2>
            <div className="card mb-4">
              <div className="card-body">
                <p><strong>Mã đơn hàng:</strong> #{orderDetails.orderId}</p>
                <p><strong>Ngày đặt:</strong> {new Date(orderDetails.createdAt).toLocaleDateString('vi-VN')}</p>
                <p><strong>Trạng thái:</strong> 
                  <span className={`badge ${orderDetails.status === 'Success' ? 'bg-success' : 'bg-warning'} ms-2`}>
                    {orderDetails.status === 'Success' ? 'Thành công' : 'Đang xử lý'}
                  </span>
                </p>
                <p><strong>Phương thức thanh toán:</strong> {orderDetails.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'VNPay'}</p>
                <p><strong>Tổng tiền:</strong> <span className="text-primary">{convertMoney(orderDetails.totalAmount)} VND</span></p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <h2 className="h4 text-uppercase mb-4">Thông tin giao hàng</h2>
            <div className="card">
              <div className="card-body">
                <p><strong>Người nhận:</strong> {orderDetails.receiverName}</p>
                <p><strong>Số điện thoại:</strong> {orderDetails.phoneNumber}</p>
                <p><strong>Địa chỉ:</strong> {orderDetails.addressDetail}, {orderDetails.ward}, {orderDetails.district}, {orderDetails.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr>
              <th className="border-0" scope="col">Sản phẩm</th>
              <th className="border-0" scope="col">Giá</th>
              <th className="border-0" scope="col">Số lượng</th>
              <th className="border-0" scope="col">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.items.map((item) => (
              <tr key={item.productId}>
                <td className="align-middle">
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.image} 
                      alt={item.productName} 
                      style={{ width: '70px', marginRight: '15px' }}
                      className="img-fluid rounded"
                    />
                    <div>
                      <h6 className="mb-0">{item.productName}</h6>
                      {item.attributes && <small className="text-muted">{item.attributes}</small>}
                    </div>
                  </div>
                </td>
                <td className="align-middle">
                  {item.salePrice ? (
                    <>
                      <del className="text-muted small">{convertMoney(item.price)} VND</del>
                      <br />
                      <span className="text-danger">{convertMoney(item.salePrice)} VND</span>
                    </>
                  ) : (
                    <span>{convertMoney(item.price)} VND</span>
                  )}
                </td>
                <td className="align-middle">
                  <span className="badge bg-secondary">{item.quantity}</span>
                </td>
                <td className="align-middle">
                  {convertMoney((item.salePrice || item.price) * item.quantity)} VND
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-light">
            <tr>
              <td colSpan="3" className="text-end"><strong>Tổng cộng:</strong></td>
              <td><strong className="text-primary">{convertMoney(orderDetails.totalAmount)} VND</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default DetailHistory;
