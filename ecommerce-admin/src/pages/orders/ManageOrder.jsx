import { Link, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { Client } from "../api-client"; // Import NSwag client
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";

const ManageOrders = () => {
  const apiClient = new Client();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await apiClient.orderGET();
      setOrders(response);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      await apiClient.cancel(orderId);
      alert(`Order ${orderId} has been canceled`);
      fetchOrders(); // Refresh orders list after cancellation
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  // Handle bulk actions dropdown
  const bulkAction = [
    { value: "delete", label: "Delete" },
    { value: "cancel", label: "Cancel" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    if (selectedOption.value === "cancel") {
      Object.keys(specificChecks).forEach((id) => {
        if (specificChecks[id]) handleCancelOrder(id);
      });
    }
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      orders.forEach((order) => {
        updateChecks[order.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckOrder = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const actionItems = ["View", "Cancel"];

  const handleActionItemClick = (item, orderId) => {
    if (item === "View") {
      navigate(`/orders/manage/${orderId}`);
    } else if (item === "Cancel") {
      handleCancelOrder(orderId);
    }
  };

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <Dropdown
                placeholder="Bulk Action"
                className="sm"
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
              <Input
                placeholder="Search Order..."
                className="sm table_search"
              />
              <div className="btn_parent">
                <Link to="/orders/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Order</span>
                </Link>
                <Button label="Advanced Filter" className="sm" />
                <Button label="Save" className="sm" />
              </div>
            </div>
            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_checkbox">
                        <CheckBox
                          onChange={handleBulkCheckbox}
                          isChecked={bulkCheck}
                        />
                      </th>
                      <th className="td_id">ID</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="td_checkbox">
                          <CheckBox
                            onChange={(isCheck) =>
                              handleCheckOrder(isCheck, order.id)
                            }
                            isChecked={specificChecks[order.id] || false}
                          />
                        </td>
                        <td className="td_id">{order.id}</td>
                        <td>{order.totalAmount}</td>
                        <td>
                          {order.status.toLowerCase() === "active" ||
                          order.status.toLowerCase() === "completed" ||
                          order.status.toLowerCase() === "approved" ||
                          order.status.toLowerCase() === "delivered" ||
                          order.status.toLowerCase() === "shipped" ||
                          order.status.toLowerCase() === "new" ||
                          order.status.toLowerCase() === "coming soon" ? (
                            <Badge
                              label={order.status}
                              className="light-success"
                            />
                          ) : order.status.toLowerCase() === "inactive" ||
                            order.status.toLowerCase() === "out of stock" ||
                            order.status.toLowerCase() === "rejected" ||
                            order.status.toLowerCase() === "locked" ||
                            order.status.toLowerCase() === "canceled" ||
                            order.status.toLowerCase() === "confirmed" ||
                            order.status.toLowerCase() === "discontinued" ? (
                            <Badge
                              label={order.status}
                              className="light-danger"
                            />
                          ) : order.status.toLowerCase() === "on sale" ||
                            order.status.toLowerCase() === "featured" ||
                            order.status.toLowerCase() === "shipping" ||
                            order.status.toLowerCase() === "processing" ||
                            order.status.toLowerCase() === "pending" ? (
                            <Badge
                              label={order.status}
                              className="light-warning"
                            />
                          ) : order.status.toLowerCase() === "archive" ||
                            order.status.toLowerCase() === "pause" ? (
                            <Badge
                              label={order.status}
                              className="light-secondary"
                            />
                          ) : (
                            order.status
                          )}
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="td_action">
                          <TableAction
                            actionItems={actionItems}
                            onActionItemClick={(item) =>
                              handleActionItemClick(item, order.id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="content_footer">
              <Dropdown
                className="top show_rows sm"
                placeholder="Rows per page"
                selectedValue={selectedValue}
                onClick={(option) => setSelectedValue(option.label)}
                options={[
                  { value: 2, label: "2" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                ]}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(orders.length / selectedValue)}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageOrders;
