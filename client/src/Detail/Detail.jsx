import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import alertify from "alertifyjs";
import convertMoney from "../convertMoney";
import { Client, AddToCartCommand, CreateReviewCommand } from "../api-client"; // Import NSwag-generated classes

function Detail() {
  const [detail, setDetail] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null); // State for the first ProductVariant
  const [quantity, setQuantity] = useState(1);
  const [reviewTab, setReviewTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [productId, setProductId] = useState(0);
  const [rating, setRating] = useState(5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const { id } = useParams();
  const apiClient = new Client();

  // Fetch product details by ID
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const productDetail = await apiClient.productGET2(Number(id));
        setDetail(productDetail);
        setProductId(productDetail.productId);
        const variants = await apiClient.variantsAll(Number(id));
        if (variants.length > 0) {
          setSelectedVariant(variants[0]); // Set the first variant as selected
        }

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
    if (selectedVariant && selectedVariant.id) {
      const addToCartCommand = new AddToCartCommand({
        productVariantId: selectedVariant.id,
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

  // Handle variant selection
  const handleVariantSelection = (variant) => {
    setSelectedVariant(variant);
    setCurrentImageIndex(0);
  };

  // Submit a new review
  const submitReview = async () => {
    const newReview = new CreateReviewCommand({
      productId: detail.id,
      rating,
      comment,
    });

    try {
      await apiClient.reviewsPOST(newReview);
      alertify.success("Review submitted successfully!");
      setComment(""); // Clear comment after submission
      setRating(5); // Reset rating
      setReviews([...reviews, newReview]); // Optimistically update the review list
    } catch (error) {
      console.error("Error submitting review:", error);
      alertify.error("Failed to submit review. Please try again.");
    }
  };

  // Sửa lại hàm getAllImages để nhóm ảnh theo variant
  const getAllImages = () => {
    if (!detail) return [];
    
    // Bắt đầu với ảnh cover
    let allImages = [{
      url: detail.coverImage,
      isCover: true,
      variantId: null
    }];
    
    // Thêm ảnh của variant được chọn (nếu có)
    if (selectedVariant?.productImages?.length) {
      const variantImages = selectedVariant.productImages.map(img => ({
        url: img.imageUrl,
        isCover: false,
        variantId: selectedVariant.id
      }));
      allImages = [...allImages, ...variantImages];
    }
    
    return allImages;
  };

  // Hàm xử lý chuyển ảnh
  const handlePrevImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const discountPercentage = selectedVariant && selectedVariant.salePrice
    ? Math.round(((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100)
    : 0;

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-6 ">
            <div className="position-relative mb-5">
              <img
                className="d-block w-100"
                src={getAllImages()[currentImageIndex]?.url}
                alt={detail.name}
                style={{ height: '500px', objectFit: 'contain' }}
              />
              
              {/* Nút điều hướng */}
              <button
                className="position-absolute top-50 start-0 translate-middle-y btn btn-dark btn-sm ms-2"
                onClick={handlePrevImage}
                style={{ left: '10px', opacity: '0.7' }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <button
                className="position-absolute top-50 end-0 translate-middle-y btn btn-dark btn-sm me-2"
                onClick={handleNextImage}
                style={{ right: '10px', opacity: '0.7' }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              {/* Hiển thị vị trí ảnh hiện tại */}
              <div 
                className="position-absolute"
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.5)', 
                  padding: '5px 10px', 
                  borderRadius: '15px',
                  // bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000
                }}
              >
                <span className="text-white">
                  {currentImageIndex + 1} / {getAllImages().length}
                </span>
              </div>
            </div>

            {/* Hiển thị thumbnail của tất cả ảnh */}
            <div className="d-flex mt-5 overflow-auto" style={{ gap: '10px'  }}>
              {/* Hiển thị ảnh cover */}
              <div
                className="mr-2 position-relative"
                style={{ minWidth: '80px', cursor: 'pointer' }}
                onClick={() => {
                  setCurrentImageIndex(0);
                  setSelectedVariant(null);
                }}
              >
                <img
                  src={detail.coverImage}
                  alt="Cover"
                  className={`img-fluid ${
                    currentImageIndex === 0 && !selectedVariant ? 'border border-primary' : 'border'
                  }`}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                  }}
                />
                <small className="d-block text-center mt-1">Cover</small>
              </div>

              {/* Hiển thị một thumbnail cho mỗi variant */}
              {detail.productVariantDTOs?.map(variant => (
                variant.productImages?.length > 0 && (
                  <div
                    key={variant.id}
                    className="mr-2 position-relative"
                    style={{ minWidth: '80px', cursor: 'pointer' }}
                    onClick={() => {
                      handleVariantSelection(variant);
                      setCurrentImageIndex(1); // Chuyển đến ảnh đầu tiên của variant
                    }}
                  >
                    <div className="position-relative">
                      {/* Stack tất cả ảnh của variant lên nhau */}
                      {variant.productImages.map((image, idx) => (
                        <img
                          key={image.id}
                          src={image.imageUrl}
                          alt={`${variant.attributes}`}
                          className={`img-fluid ${
                            selectedVariant?.id === variant.id ? 'border border-primary' : 'border'
                          }`}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: idx === 0 ? 1 : 0, // Chỉ hiện ảnh đầu tiên
                          }}
                        />
                      ))}
                      {/* Ảnh hiển thị mặc định */}
                      <img
                        src={variant.productImages[0].imageUrl}
                        alt={`${variant.attributes}`}
                        className={`img-fluid ${
                          selectedVariant?.id === variant.id ? 'border border-primary' : 'border'
                        }`}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                        }}
                      />
                      {/* Badge hiển thị số lượng ảnh */}
                      {variant.productImages.length > 1 && (
                        <span
                          className="position-absolute top-0 end-0 badge bg-primary"
                          style={{ top: '-10px', right: '-10px' }}
                        >
                          {variant.productImages.length}
                        </span>
                      )}
                    </div>
                    <small className="d-block text-center mt-1">{variant.attributes}</small>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="col-lg-6 text-3xl font-bold p-5 card">
            <h1>{detail.name}</h1>
            <p className="text-muted lead">
              {convertMoney(
                selectedVariant ? selectedVariant.salePrice : detail.price
              )} VND {" "}
              {selectedVariant && selectedVariant.salePrice < selectedVariant.price && (
                <span className="text-danger ml-2">
                  <del>{convertMoney(selectedVariant.price)} VND</del>
                </span>
              )}
            </p>
            {discountPercentage > 0 && (
              <p className="text-success">Save {discountPercentage}%</p>
            )}

            <div className="mb-4">
              <label className="font-weight-bold">Select Variant:</label>
              <div className="variant-buttons d-flex flex-wrap">
                {detail?.productVariantDTOs?.map((variant) => (
                  <button
                    key={variant.id}
                    className={`btn btn-outline-primary mr-2 mb-2 ${
                      selectedVariant && selectedVariant.id === variant.id ? "active" : ""
                    }`}
                    onClick={() => handleVariantSelection(variant)}
                  >
                    {variant.attributes} 
                  </button>
                ))}
              </div>
            </div>


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

        {/* Tabs cho Mô tả và Đánh giá */}
        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <button
              className={`nav-link ${
                reviewTab === "description" ? "active" : ""
              }`}
              onClick={() => handleReviewTab("description")}
            >
              Mô tả sản phẩm
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${reviewTab === "reviews" ? "active" : ""}`}
              onClick={() => handleReviewTab("reviews")}
            >
              Đánh giá
            </button>
          </li>
        </ul>

        <div className="tab-content py-4">
          {/* Tab Mô tả */}
          {reviewTab === "description" && (
            <div className="bg-white p-4 rounded shadow-sm">
              <h5 className="text-xl font-semibold mb-3">Mô tả chi tiết</h5>
              <p className="text-gray-700 leading-relaxed">{detail.description}</p>
            </div>
          )}

          {/* Tab Đánh giá */}
          {reviewTab === "reviews" && (
            <div className="bg-white row p-4 rounded shadow-sm">
              <div className="mb-6 col-lg-4">
                <h5 className="text-xl font-semibold mb-4">
                  Đánh giá từ khách hàng ({reviews.length})
                </h5>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex justify-between row mb-2">
                          <div className="text-sm col-lg-6 font-medium text-gray-700">
                            
                            <div className="text-black"><strong>{review.customerName}</strong>   </div>
                            <div className=" text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(review.rating)].map((_, i) => (
                                <i key={i} className="fas fa-star"></i>
                              ))}
                              {[...Array(5 - review.rating)].map((_, i) => (
                                <i key={i} className="far fa-star"></i>
                              ))}
                            </div>
                            
                          </div>
                          {/* Thêm tên người đánh giá */}
                          
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa có đánh giá nào.</p>
                )}
              </div>

              {/* Form đánh giá */}
              <div className="bg-gray-50 p-4 rounded col-lg-8">
                <h5 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h5>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Đánh giá của bạn:</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        <i className={`${rating >= star ? 'fas' : 'far'} fa-star text-yellow-400`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nhận xét của bạn:</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <button 
                  className="btn btn-primary px-4"
                  onClick={submitReview}
                  disabled={!comment.trim()} // Disable nút nếu chưa có comment
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Gửi đánh giá
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Detail;