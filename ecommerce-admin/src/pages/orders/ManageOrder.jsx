import { Link, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { Client } from "../api-client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from API (once, since backend doesn't support pagination)
  const fetchOrders = async () => {
    try {
      const response = await apiClient.orderGET();
      setOrders(response); // Save the entire list of orders
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await apiClient.cancel(orderId);
      alert(`Order ${orderId} has been canceled`);
      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        ID: order.id,
        "Total Amount": order.totalAmount,
        Status: order.status,
        "Created At": new Date(order.createdAt).toLocaleDateString(),
        "Updated At": new Date(order.updatedAt).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    XLSX.writeFile(workbook, "Orders.xlsx");
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(search) || // Search by ID
      order.totalAmount.toString().includes(search) // Search by amount
    );
  });

  // Calculate data for current page
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                placeholder="Search Order by ID or Amount..."
                className="sm table_search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="btn_parent">
                <Link to="/orders/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Order</span>
                </Link>
                <Button label="Advanced Filter" className="sm" />
                <Button label="Save" className="sm" />
                <Button
                  label="Export Excel"
                  className="sm"
                  icon={<Icons.TbFileExport />}
                  onClick={exportToExcel}
                />
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
                    {paginatedOrders.map((order) => (
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
                          <Badge
                            label={order.status}
                            className={
                              ["active", "completed", "approved"].includes(
                                order.status.toLowerCase()
                              )
                                ? "light-success"
                                : ["canceled", "rejected"].includes(
                                    order.status.toLowerCase()
                                  )
                                ? "light-danger"
                                : "light-warning"
                            }
                          />
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
                selectedValue={itemsPerPage}
                onClick={(option) => setItemsPerPage(option.value)}
                options={[
                  { value: 2, label: "2" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                ]}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
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
