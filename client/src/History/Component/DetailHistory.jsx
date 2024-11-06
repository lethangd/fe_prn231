import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HistoryAPI from "../../API/HistoryAPI";

function DetailHistory(props) {
  const { id } = useParams(); // Lấy ID từ URL để gọi API chi tiết đơn hàng

  const [cart, setCart] = useState([]); // Danh sách các sản phẩm trong giỏ hàng
  const [information, setInformation] = useState({}); // Thông tin đơn hàng

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy chi tiết đơn hàng theo ID
        const response = await HistoryAPI.getDetail(id);
        console.log(response); // Kiểm tra dữ liệu trả về

        // Lưu thông tin đơn hàng vào state
        setInformation(response);
        setCart(response.products); // Lưu danh sách sản phẩm trong đơn hàng
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      }
    };

    fetchData(); // Gọi hàm fetchData khi component được mount
  }, [id]); // Chạy lại useEffect khi ID thay đổi

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Detail Order</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">Detail</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Hiển thị thông tin đơn hàng */}
      <div className="p-5">
        <h1 className="h2 text-uppercase">Order Information</h1>
        <p>Order ID: {information.orderId}</p>
        <p>Receiver: {information.nameReceiver}</p>
        <p>Phone: {information.phoneReceiver}</p>
        <p>Address: {information.addressReceiver}</p>
        <p>Total Price: ${information.totalPrice}</p>
        <p>Payment Method: {information.payment}</p>
        <p>Status: {information.status}</p>
        <p>
          Order Date: {new Date(information.orderDate).toLocaleDateString()}
        </p>
      </div>

      {/* Bảng hiển thị các sản phẩm trong đơn hàng */}
      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  ID Product
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Name</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Price</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Quantity</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {cart &&
              cart.map((product) => (
                <tr className="text-center" key={product.productId}>
                  <td className="align-middle border-0">
                    <h6 className="mb-0">{product.productId}</h6>
                  </td>
                  <td className="align-middle border-0">
                    <h6 className="mb-0">{product.productName}</h6>
                  </td>
                  <td className="align-middle border-0">
                    <h6 className="mb-0">${product.listPrice}</h6>
                  </td>
                  <td className="align-middle border-0">
                    <h6 className="mb-0">{product.quantity}</h6>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailHistory;
