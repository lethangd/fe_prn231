import React, { useEffect, useState } from "react";
import ProductAPI from "../API/ProductAPI";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  const [loadComment, setLoadComment] = useState(false);
  const [text, setText] = useState(1);
  const [review, setReview] = useState("description");

  const dispatch = useDispatch();
  const { id } = useParams();
  const id_user = useSelector((state) => state.Cart.id_user);

  // Lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      const response = await ProductAPI.getDetail(id);
      console.log(response);
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
    let id_user_cart = localStorage.getItem("id_user") || id_user;

    const data = {
      idUser: id_user_cart,
      idProduct: detail.productId,
      nameProduct: detail.productName,
      priceProduct: detail.listPrice,
      count: text,
      img: detail.image,
    };

    if (localStorage.getItem("id_user")) {
      const fetchPost = async () => {
        const params = {
          idUser: id_user_cart,
          idProduct: detail.productId,
          count: text,
        };
        const query = "?" + queryString.stringify(params);
        await CartAPI.postAddToCart(query);
      };
      fetchPost();
    } else {
      dispatch(addCart(data));
    }

    alertify.set("notifier", "position", "bottom-left");
    alertify.success("Bạn Đã Thêm Hàng Thành Công!");
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
            <div
              className="carousel slide"
              id="carouselExampleControls"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                {detail.image && (
                  <div className="carousel-item active">
                    <img
                      className="d-block w-100"
                      src={detail.image}
                      alt="Product"
                    />
                  </div>
                )}
                {/* Add more images if available */}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <h1>{detail.productName}</h1>
            <p className="text-muted lead">
              {convertMoney(detail.listPrice)} VND
            </p>
            <p
              className="text-small mb-4"
              dangerouslySetInnerHTML={{ __html: detail.subDescription }}
            />

            <ul className="list-unstyled small d-inline-block">
              <li className="mb-3 bg-white text-muted">
                <strong className="text-uppercase text-dark">Category:</strong>
                <span className="ml-2">{detail.categoryId}</span>{" "}
                {/* Update category if available */}
              </li>
            </ul>

            <div className="row align-items-stretch mb-4">
              <div className="col-sm-5 pr-sm-0">
                <div className="border d-flex align-items-center justify-content-between py-1 px-3 bg-white border-white">
                  <span className="small text-uppercase text-gray mr-4 no-select">
                    Quantity
                  </span>
                  <div className="quantity">
                    <button
                      className="dec-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={downText}
                    >
                      <i className="fas fa-caret-left"></i>
                    </button>
                    <input
                      className="form-control border-0 shadow-0 p-0"
                      type="text"
                      value={text}
                      onChange={onChangeText}
                    />
                    <button
                      className="inc-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={upText}
                    >
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

        {/* Tabs */}
        <ul className="nav nav-tabs border-0">
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => handlerReview("description")}
              style={
                review === "description"
                  ? { backgroundColor: "#383838", color: "#fff" }
                  : {}
              }
            >
              Description
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => handlerReview("reviews")}
              style={
                review === "reviews"
                  ? { backgroundColor: "#383838", color: "#fff" }
                  : {}
              }
            >
              Reviews
            </a>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content mb-5">
          {review === "description" ? (
            <div className="tab-pane fade show active">
              <h6 className="text-uppercase">Product description</h6>
              <div dangerouslySetInnerHTML={{ __html: detail.description }} />
            </div>
          ) : (
            <div className="tab-pane fade show active">
              <div className="p-4 p-lg-5 bg-white">
                {listComment.map((comment) => (
                  <div className="media mb-3" key={comment._id}>
                    <img
                      className="rounded-circle"
                      src="https://img.icons8.com/color/36/000000/administrator-male.png"
                      alt="user avatar"
                      width="50"
                    />
                    <div className="media-body ml-3">
                      <h6 className="mb-0">{comment.fullname}</h6>
                      <p className="small text-muted">{comment.date}</p>
                      <p className="text-small">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <h2 className="h5 text-uppercase mb-4">Related Products</h2>
        <div className="row">
          {product
            .filter(
              (p) =>
                p.categoryId === detail.categoryId &&
                p.productId !== detail.productId
            )
            .map((relatedProduct) => (
              <div className="col-lg-3 col-sm-6" key={relatedProduct.productId}>
                <div className="product text-center">
                  <div className="d-block mb-3 position-relative">
                    <img
                      className="img-fluid w-100"
                      src={relatedProduct.image}
                      alt={relatedProduct.productName}
                    />
                  </div>
                  <h6>
                    <Link
                      className="reset-anchor"
                      to={`/detail/${relatedProduct.productId}`}
                    >
                      {relatedProduct.productName}
                    </Link>
                  </h6>
                  <p className="small text-muted">
                    {convertMoney(relatedProduct.listPrice)} VND
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Detail;
