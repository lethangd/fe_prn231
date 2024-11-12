import React, { useState } from "react";
import convertMoney from "../../convertMoney";

function ListCart({ listCart, onDeleteCart, onUpdateQuantity }) {
  const [tempQuantities, setTempQuantities] = useState({});

  const handleQuantityChange = (productVariantId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setTempQuantities(prev => ({
      ...prev,
      [productVariantId]: newQuantity
    }));

    const timeoutId = setTimeout(() => {
      onUpdateQuantity(productVariantId, newQuantity);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="table-responsive mb-4">
      <table className="table">
        <thead className="bg-light">
          <tr className="text-center">
            <th className="border-0" scope="col">
              <strong className="text-small text-uppercase">No.</strong>
            </th>
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
          {listCart &&
            listCart.map((value, index) => {
              const displayQuantity = tempQuantities[value.productVariantId] || value.quantity;
              
              return (
                <tr className="text-center" key={value.productVariantId}>
                  <td className="align-middle">
                    <span className="font-weight-bold">{index + 1}</span>
                  </td>
                  <td className="align-middle">
                    <img src={value.image} alt={value.name} width="70" />
                  </td> 
                  <td className="align-middle">
                    <div className="media align-items-center justify-content-center">
                      <div className="media-body">
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="text-muted small">
                            <a href={`/detail/${value.productId}`}>{value.productName && `${value.productName} (${value.attributes})`}</a>
                          </div>
                        </div>
                        <p className="mb-0 text-small">
                          {value.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="align-middle">
                    <div className="price-container">
                      {value.originalPrice !== value.price ? (
                        <>
                          <p className="mb-0 small text-muted text-decoration-line-through">
                            <del>{convertMoney(value.price)} VND</del>
                          </p>
                          <p className="mb-0 small text-danger">
                            {convertMoney(value.salePrice)} VND
                          </p>
                        </>
                      ) : (
                        <p className="mb-0 small">
                          {convertMoney(value.price)} VND
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="border d-flex align-items-center justify-content-between px-3">
                      <div className="quantity">
                        <button 
                          className="dec-btn p-0"
                          onClick={() => handleQuantityChange(value.productVariantId, displayQuantity - 1)}
                          disabled={displayQuantity <= 1}
                        >
                          <i className="fas fa-caret-left"></i>
                        </button>
                        <input
                          className="form-control border-0 shadow-0 p-0"
                          type="text"
                          value={displayQuantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity >= 1) {
                              handleQuantityChange(value.productVariantId, newQuantity);
                            }
                          }}
                          min="1"
                        />
                        <button 
                          className="inc-btn p-0"
                          onClick={() => handleQuantityChange(value.productVariantId, displayQuantity + 1)}
                        >
                          <i className="fas fa-caret-right"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="total-price-container">
                      {value.originalPrice !== value.price ? (
                        <>
                          <p className="mb-0 small text-muted text-decoration-line-through">
                            {convertMoney(value.price * value.quantity)} VND
                          </p>
                          <p className="mb-0 small text-danger">
                            {convertMoney(value.salePrice * value.quantity)} VND
                          </p>
                        </>
                      ) : (
                        <p className="mb-0 small">
                          {convertMoney(value.price * value.quantity)} VND
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="align-middle">
                    <button
                      className="btn btn-link text-dark p-0"
                      onClick={() => onDeleteCart(value.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ListCart;
