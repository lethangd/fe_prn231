import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import { Client } from "../api-client"; // NSwag-generated API client
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import truck from "../../images/common/delivery-truck.gif";

const OrderDetail = () => {
  const { orderID } = useParams();
  const apiClient = new Client();
  const [order, setOrder] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrderDetails(orderID);
  }, [orderID]);

  const fetchOrderDetails = async (id) => {
    try {
      const orderData = await apiClient.orderGET2(id);
      setOrder(orderData);
      setCustomerId(orderData.userId);
      setProducts(orderData.items);
      setStatus(orderData.status);

      // Fetch product details for each item
      const details = {};
      for (let product of orderData.items) {
        const productData = await apiClient.productGET2(product.productId);
        details[product.productId] = productData;
      }
      setProductDetails(details);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleInvoice = () => {
    alert("Under Construction: Invoice page");
  };

  const handleCancelOrder = async () => {
    try {
      await apiClient.cancel(orderID);
      alert(`Order ${orderID} has been canceled`);
      fetchOrderDetails(orderID);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await apiClient.orderPUT(orderID, newStatus);
      alert(`Order status updated to ${newStatus}`);
      fetchOrderDetails(orderID);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Order #{order.orderId}</span>
                <Button
                  icon={<Icons.TbDownload />}
                  label="Invoice"
                  className="bg_light_success sm"
                  onClick={handleInvoice}
                />
              </h2>
              <table className="bordered">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Item Price</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const productData = productDetails[product.productId] || {};
                    return (
                      <tr key={product.productId}>
                        <td>
                          <img
                            src={
                              productData.imageThumbnail || "/placeholder.jpg"
                            }
                            alt={productData.name || "Product Image"}
                            width={50}
                            height={50}
                          />
                        </td>
                        <td>
                          <Link to={`/catalog/product/manage/${product.id}`}>
                            {productData.name || product.name}
                          </Link>
                        </td>
                        <td>${product.price || "N/A"}</td>
                        <td>{product.quantity}</td>
                        <td>
                          ${(product.price * product.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="4" className="td_no_p">
                      <b>Total Amount</b>
                    </td>
                    <td className="td_no_p">
                      <b>${order.totalAmount}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Order Status</span>
                <Button
                  icon={<Icons.TbMapPin />}
                  label="Address Change"
                  className="bg_light_primary sm right"
                />
                <Button
                  icon={<Icons.TbShoppingCartCancel />}
                  label="Cancel Order"
                  className="bg_light_danger sm"
                  onClick={handleCancelOrder}
                />
              </h2>
              <select
                className="dropdown_placeholder"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div className="order_status">
                <div className="order_status_item">
                  <div className="order_status_icon">
                    {order.status === "Pending" && <Icons.TbChecklist />}
                    {order.status === "Processing" && <Icons.TbReload />}
                    {order.status === "Confirmed" && <Icons.TbPackage />}
                    {order.status === "Shipping" && <Icons.TbTruckDelivery />}
                    {order.status === "Delivered" && (
                      <Icons.TbShoppingBagCheck />
                    )}
                  </div>
                  <div className="order_status_content">
                    <h3>{order.status}</h3>
                    <p>{new Date(order.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <div className="logistics_item">
                <img src={truck} alt="Delivery truck" height="100px" />
                <p>
                  <b>Order Date:</b>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <b>Shipping Address:</b>
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                  , {order.shippingAddress?.state}, {order.shippingAddress?.zip}
                </p>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Customer ID:</h2>
              <p>{customerId}</p>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Payment Details:</h2>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <b>Total Amount:</b>
                    <p>${order.totalAmount}</p>
                  </div>
                  <div className="detail_list_item">
                    <b>Status:</b>
                    <Badge label={order.status} className="light-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
