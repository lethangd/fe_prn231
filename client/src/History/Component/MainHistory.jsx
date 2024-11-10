// components/MainHistory.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import alertify from "alertifyjs";
import { Client } from "../../api-client"; // Import NSwag-generated Client

function MainHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = new Client();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken"); // Get token from localStorage

      if (!token) {
        alertify.error("You need to log in to view your order history.");
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.orderGET({
          headers: { Authorization: `Bearer ${token}` }, // Add token to headers
        });
        setOrders(response); // Store fetched orders in state
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError("Failed to fetch order history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Order History</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">History</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Order ID</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">User ID</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Total</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Status</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">
                  Created At
                </strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Detail</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="text-center" key={order.id}>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{order.id}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{order.userId}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">${order.totalAmount}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">{order.status}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="align-middle border-0">
                  <Link
                    className="btn btn-outline-dark btn-sm"
                    to={`/history/${order.id}`}
                  >
                    View
                    <i className="fas fa-long-arrow-alt-right ml-2"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainHistory;
