import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import convertMoney from "../../convertMoney";

Products.propTypes = {
  products: PropTypes.array,
  sort: PropTypes.string,
};

Products.defaultProps = {
  products: [],
  sort: "",
};

function Products(props) {
  const { products, sort } = props;

  // Xử lý sắp xếp theo giá (from low to high hoặc high to low)
  if (sort === "DownToUp") {
    products.sort((a, b) => a.listPrice - b.listPrice);
  } else if (sort === "UpToDown") {
    products.sort((a, b) => b.listPrice - a.listPrice);
  }

  return (
    <div className="row">
      {/* -------------Product----------------- */}
      {products &&
        products.map((product) => (
          <div
            className="col-lg-4 col-sm-6 Section_Category"
            key={product.productId}
          >
            <div className="product text-center">
              <div className="position-relative mb-3">
                {/* Nếu bạn có badge hoặc muốn thêm các thẻ cho sản phẩm, có thể sử dụng phần này */}
                <div className="badge text-white badge-"></div>

                {/* Link đến trang chi tiết sản phẩm */}
                <Link className="d-block" to={`/detail/${product.productId}`}>
                  <img
                    className="img-fluid w-100"
                    src={product.image}
                    alt={product.productName}
                  />
                </Link>

                <div className="product-overlay">
                  {/* Bạn có thể thêm các icon, nút hoặc tùy chỉnh khác ở đây */}
                  <ul className="mb-0 list-inline"></ul>
                </div>
              </div>

              {/* Tên sản phẩm */}
              <h6>
                <a
                  className="reset-anchor"
                  href={`/detail/${product.productId}`}
                >
                  {product.productName}
                </a>
              </h6>

              {/* Giá sản phẩm */}
              <p className="small text-muted">
                {convertMoney(product.listPrice)} VND
              </p>
            </div>
          </div>
        ))}
      {/* -------------Product----------------- */}
    </div>
  );
}

export default Products;
