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

function Products({ products, sort }) {
  // Sort products by price based on `sort` prop
  const sortedProducts = [...products];
  if (sort === "DownToUp") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "UpToDown") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="row">
      {sortedProducts.map((product) => (
        <div className="col-lg-4 col-sm-6 Section_Category" key={product.id}>
          <div className="product text-center">
            <div className="position-relative mb-3">
              <Link className="d-block" to={`/detail/${product.id}`}>
                <img
                  className="img-fluid w-100"
                  src={product.image || "/path/to/default-image.jpg"}
                  alt={product.name}
                />
              </Link>
              <div className="product-overlay">
                <ul className="mb-0 list-inline"></ul>
              </div>
            </div>

            {/* Product name */}
            <h6>
              <Link className="reset-anchor" to={`/detail/${product.id}`}>
                {product.name}
              </Link>
            </h6>

            {/* Display price, prioritize `salePrice` if available */}
            <p className="small text-muted">
              {product.salePrice
                ? `${convertMoney(product.salePrice)} VND`
                : `${convertMoney(product.price)} VND`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
