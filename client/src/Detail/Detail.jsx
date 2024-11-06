// components/Detail.js
import React, { useEffect, useState } from "react";
import ProductAPI from "../API/ProductAPI";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import alertify from "alertifyjs";
import { addCart } from "../Redux/Action/ActionCart";
import CartAPI from "../API/CartAPI";
import queryString from "query-string";
import CommentAPI from "../API/CommentAPI";
import convertMoney from "../convertMoney";

function Detail(props) {
  const [detail, setDetail] = useState({});
  const [product, setProduct] = useState([]);
  const [star, setStar] = useState(1);
  const [comment, setComment] = useState("");
  const [listComment, setListComment] = useState([]);
  const [text, setText] = useState(1);
  const [review, setReview] = useState("description");

  const dispatch = useDispatch();
  const { id } = useParams();
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  // Lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      const response = await ProductAPI.getDetail(id);
      setDetail(response);
    };
    fetchData();
  }, [id]);

  // Lấy danh sách sản phẩm liên quan
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const params = { page: 1, count: 8 };
      try {
        const response = await ProductAPI.getAPI(queryString.stringify(params));
        setProduct(response.items);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm: ", error);
      }
    };
    fetchRelatedProducts();
  }, []);

  // Cập nhật số lượng
  const onChangeText = (e) => setText(e.target.value);

  const upText = () => setText((prev) => prev + 1);
  const downText = () => setText((prev) => (prev > 1 ? prev - 1 : 1));

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = () => {
    const productData = {
      idProduct: detail.productId,
      nameProduct: detail.productName,
      priceProduct: detail.listPrice,
      count: text,
      img: detail.image,
    };

    // Dispatch action thêm sản phẩm vào giỏ hàng Redux
    dispatch(addCart(productData));

    alertify.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  // Chuyển đổi giữa Description và Review
  const handlerReview = (value) => {
    setReview(value);
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-6">
            <img className="d-block w-100" src={detail.image} alt="Product" />
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
                    <button className="dec-btn p-0" onClick={downText}>
                      <i className="fas fa-caret-left"></i>
                    </button>
                    <input
                      className="form-control border-0 shadow-0 p-0"
                      type="text"
                      value={text}
                      onChange={onChangeText}
                    />
                    <button className="inc-btn p-0" onClick={upText}>
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

        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => handlerReview("description")}
            >
              Description
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => handlerReview("reviews")}>
              Reviews
            </a>
          </li>
        </ul>

        <div className="tab-content py-4">
          {review === "description" && (
            <div>
              <h5>Description</h5>
              <p>{detail.description}</p>
            </div>
          )}
          {review === "reviews" && (
            <div>
              <h5>Reviews</h5>
              <textarea
                className="form-control mb-2"
                placeholder="Write a review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div>
                <label>Rating:</label>
                <select
                  value={star}
                  onChange={(e) => setStar(e.target.value)}
                  className="form-control w-auto mb-2"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <option key={i} value={i}>
                      {i} Stars
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary">Submit Review</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Detail;
