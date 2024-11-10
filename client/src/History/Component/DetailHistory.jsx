// components/DetailHistory.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "../../api-client"; // Import NSwag-generated Client

function DetailHistory() {
  const { id } = useParams(); // Get order ID from URL
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
              <h1 className="h2 text-uppercase mb-0">Order Details</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">Order Details</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Order Information */}
      <div className="p-5">
        <h1 className="h2 text-uppercase">Order Information</h1>
        <p>Order ID: {orderDetails.orderId}</p>
        <p>Total Amount: ${orderDetails.totalAmount}</p>
        <p>Status: {orderDetails.status}</p>
      </div>

      {/* Order Items Table */}
      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Product ID
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Quantity</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Price</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.items.map((item) => (
              <tr className="text-center" key={item.productId}>
                <td className="align-middle border-0">
                  <h6 className="mb-0">{item.productId}</h6>
                </td>
                <td className="align-middle border-0">
                  <h6 className="mb-0">{item.quantity}</h6>
                </td>
                <td className="align-middle border-0">
                  <h6 className="mb-0">${item.price}</h6>
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
