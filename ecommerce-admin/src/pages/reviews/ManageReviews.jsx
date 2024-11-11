import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Rating from "../../components/common/Rating.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import { Client } from "../api-client"; // Import the NSwag API client

const ManageReviews = () => {
  const apiClient = new Client();
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const tableRow = [
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewsData = await apiClient.reviewsGETAll();
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    const updateChecks = {};
    reviews.forEach((review) => {
      updateChecks[review.id] = isCheck;
    });
    setSpecificChecks(updateChecks);
  };

  const handleCheckReview = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };

  const actionItems = ["Delete", "Edit"];

  const handleActionItemClick = (item, itemID) => {
    const updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      alert(`#${itemID} item delete`);
    } else if (updateItem === "edit") {
      navigate(`/reviews/${itemID}`);
    }
  };

  return (
    <section className="reviews">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <Dropdown
                placeholder="Bulk Action"
                className="sm"
                onClick={bulkActionDropDown}
                options={[
                  { value: "delete", label: "Delete" },
                  { value: "category", label: "Category" },
                  { value: "status", label: "Status" },
                ]}
              />
              <Input
                placeholder="Search Review..."
                className="sm table_search"
              />
              <div className="btn_parent">
                <Button label="Advance Filter" className="sm" />
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
                      <th>Product ID</th>
                      <th>Customer ID</th>
                      <th>Stars</th>
                      <th>Comment</th>
                      <th>Created At</th>
                      <th className="td_status">Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review.id}>
                        <td className="td_checkbox">
                          <CheckBox
                            onChange={(isCheck) =>
                              handleCheckReview(isCheck, review.id)
                            }
                            isChecked={specificChecks[review.id] || false}
                          />
                        </td>
                        <td className="td_id">{review.id}</td>
                        <td>
                          <Link
                            to={`/catalog/product/manage/${review.productId}`}
                          >
                            {review.productId}
                          </Link>
                        </td>
                        <td>{review.customerId}</td>
                        <td>
                          <Rating value={review.rating} />
                        </td>
                        <td className="td_review">
                          <p>{review.comment}</p>
                        </td>
                        <td>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                        <td className="td_status">
                          {review.status === "active" ? (
                            <Badge label="Active" className="light-success" />
                          ) : (
                            <Badge label="Inactive" className="light-danger" />
                          )}
                        </td>
                        <td className="td_action">
                          <TableAction
                            actionItems={actionItems}
                            onActionItemClick={(item) =>
                              handleActionItemClick(item, review.id)
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
                placeholder="Please select"
                selectedValue={selectedValue}
                onClick={showTableRow}
                options={tableRow}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageReviews;
