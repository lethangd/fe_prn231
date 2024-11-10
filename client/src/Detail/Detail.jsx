// components/Detail.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import alertify from "alertifyjs";
import convertMoney from "../convertMoney";
import { Client, AddToCartCommand, CreateReviewCommand } from "../api-client"; // Import NSwag-generated classes

function Detail() {
  const [detail, setDetail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewTab, setReviewTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);

  const { id } = useParams();
  const apiClient = new Client();

  // Fetch product details by ID
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const productDetail = await apiClient.productGET2(Number(id));
        setDetail(productDetail);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // Fetch product reviews by ID
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewData = await apiClient.reviewsGET(Number(id));
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      }
    };

    fetchReviews();
  }, [id]);

  // Increase or decrease quantity
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Add product to cart
  const addToCart = async () => {
    if (detail && detail.productId) {
      const addToCartCommand = new AddToCartCommand({
        productVariantId: detail.productId,
        quantity,
      });

      try {
        await apiClient.cartsPOST(addToCartCommand);
        alertify.success("Product added to cart successfully!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alertify.error("Failed to add product to cart. Please try again.");
      }
    }
  };

  // Handle review tab selection
  const handleReviewTab = (tab) => setReviewTab(tab);

  // Submit a new review
  const submitReview = async () => {
    const newReview = new CreateReviewCommand({
      productId: detail.productId,
      rating,
      comment,
    });

    try {
      await apiClient.reviewsPOST(newReview);
      alertify.success("Review submitted successfully!");
      setComment(""); // Clear comment after submission
      setRating(1); // Reset rating
      setReviews([...reviews, newReview]); // Optimistically update the review list
    } catch (error) {
      console.error("Error submitting review:", error);
      alertify.error("Failed to submit review. Please try again.");
    }
  };

  // Loading or error state handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-6">
            <img
              className="d-block w-100"
              src={detail.image}
              alt={detail.productName}
            />
          </div>

          <div className="col-lg-6">
            <h1>{detail.productName}</h1>
            <p className="text-muted lead">
              {convertMoney(detail.listPrice)} VND
            </p>

            <div className="row align-items-stretch mb-4">
              <div className="col-sm-5 pr-sm-0">
                <div className="border d-flex align-items-center justify-content-between py-1 px-3 bg-white border-white">
                  <span className="small text-uppercase text-gray mr-4 no-select">
                    Quantity
                  </span>
                  <div className="quantity">
                    <button className="dec-btn p-0" onClick={decreaseQuantity}>
                      <i className="fas fa-caret-left"></i>
                    </button>
                    <input
                      className="form-control border-0 shadow-0 p-0"
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <button className="inc-btn p-0" onClick={increaseQuantity}>
                      <i className="fas fa-caret-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 pl-sm-0">
                <button
                  className="btn btn-dark btn-sm btn-block"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Description and Reviews */}
        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <button
              className={`nav-link ${
                reviewTab === "description" ? "active" : ""
              }`}
              onClick={() => handleReviewTab("description")}
            >
              Description
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${reviewTab === "reviews" ? "active" : ""}`}
              onClick={() => handleReviewTab("reviews")}
            >
              Reviews
            </button>
          </li>
        </ul>

        <div className="tab-content py-4">
          {/* Description Tab */}
          {reviewTab === "description" && (
            <div>
              <h5>Description</h5>
              <p>{detail.description}</p>
            </div>
          )}

          {/* Reviews Tab */}
          {reviewTab === "reviews" && (
            <div>
              <h5>Reviews</h5>
              <ul className="list-unstyled">
                {reviews.map((review) => (
                  <li key={review.id} className="mb-2">
                    <strong>Rating:</strong> {review.rating} / 5
                    <p>{review.comment}</p>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </li>
                ))}
              </ul>

              {/* Review Form */}
              <h5>Write a Review</h5>
              <textarea
                className="form-control mb-2"
                placeholder="Write a review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div>
                <label>Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="form-control w-auto mb-2"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} Stars
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Detail;
