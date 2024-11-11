import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import { Client } from "../api-client"; // NSwag-generated API client
import Badge from "../../components/common/Badge.jsx";
import Rating from "../../components/common/Rating.jsx";
import Button from "../../components/common/Button.jsx";
import Profile from "../../components/common/Profile.jsx";
import truck from "../../images/common/delivery-truck.gif";

const OrderDetail = () => {
  const { orderID } = useParams();
  const apiClient = new Client();
  const [order, setOrder] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchOrderDetails(orderID);
  }, [orderID]);

  const fetchOrderDetails = async (id) => {
    try {
      // Fetch order details
      const orderData = await apiClient.orderGET2(id);
      setOrder(orderData);
      setCustomerId(orderData.userId); // Set customer ID directly

      setProducts(orderData.items);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleInvoice = () => {
    alert("Under Construction: Invoice page");
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
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.imageThumbnail || "/placeholder.jpg"}
                          alt={product.name}
                        />
                      </td>
                      <td>
                        <Link to={`/catalog/product/manage/${product.id}`}>
                          {product.name}
                        </Link>
                      </td>
                      <td>${product.price || "N/A"}</td>
                      <td>{product.quantity}</td>
                      <td>${(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
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
                />
              </h2>
              <div className="order_status">
                <div className="order_status_item">
                  <div className="order_status_icon">
                    {order.status === "Pending" && <Icons.TbChecklist />}
                    {order.status === "Processing" && <Icons.TbReload />}
                    {order.status === "Shipped" && <Icons.TbTruckDelivery />}
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
