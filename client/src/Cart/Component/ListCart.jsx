import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import convertMoney from "../../convertMoney";

ListCart.propTypes = {
  listCart: PropTypes.array,
  onDeleteCart: PropTypes.func,
  onUpdateCount: PropTypes.func,
};

ListCart.defaultProps = {
  listCart: [],
  onDeleteCart: null,
  onUpdateCount: null,
};

function ListCart({ listCart, onDeleteCart, onUpdateCount }) {
  const handleDelete = (itemId) => {
    if (onDeleteCart) onDeleteCart(itemId);
  };

  const handleQuantityChange = (productId, quantity, action) => {
    if (!onUpdateCount) return;
    const updatedQuantity = action === "increase" ? quantity + 1 : quantity - 1;
    if (updatedQuantity > 0) onUpdateCount(productId, updatedQuantity);
  };

  return (
    <div className="table-responsive mb-4">
      <table className="table">
        <thead className="bg-light">
          <tr className="text-center">
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Image</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Product</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Price</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Quantity</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Total</strong>
            </th>
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">Remove</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {listCart.map((item) => (
            <tr className="text-center" key={item.id}>
              <td className="pl-0 border-0">
                <div className="media align-items-center justify-content-center">
                  <Link
                    className="reset-anchor d-block animsition-link"
                    to={`/detail/${item.productId}`}
                  >
                    <img
                      src={item.image || "/path/to/default-image.jpg"}
                      alt={item.productName}
                      width="70"
                    />
                  </Link>
                </div>
              </td>
              <td className="align-middle border-0">
                <div className="media align-items-center justify-content-center">
                  <Link
                    className="reset-anchor h6 animsition-link"
                    to={`/detail/${item.productId}`}
                  >
                    {item.productName}
                  </Link>
                  <p className="small text-muted">{item.attributes}</p>
                </div>
              </td>
              <td className="align-middle border-0">
                <p className="mb-0 small">{convertMoney(item.price)} VND</p>
              </td>
              <td className="align-middle border-0">
                <div className="quantity justify-content-center">
                  <button
                    className="dec-btn p-0"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity, "decrease")
                    }
                  >
                    <i className="fas fa-caret-left"></i>
                  </button>
                  <input
                    className="form-control form-control-sm border-0 shadow-0 p-0"
                    type="text"
                    value={item.quantity}
                    readOnly
                  />
                  <button
                    className="inc-btn p-0"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity, "increase")
                    }
                  >
                    <i className="fas fa-caret-right"></i>
                  </button>
                </div>
              </td>
              <td className="align-middle border-0">
                <p className="mb-0 small">
                  {convertMoney(item.price * item.quantity)} VND
                </p>
              </td>
              <td className="align-middle border-0">
                <button
                  className="reset-anchor remove_cart"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(item.id)}
                >
                  <i className="fas fa-trash-alt small text-muted"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListCart;
