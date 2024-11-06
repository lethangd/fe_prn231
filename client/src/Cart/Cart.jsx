import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCart, updateCart } from "../Redux/Action/ActionCart";
import ListCart from "./Component/ListCart";
import alertify from "alertifyjs";
import { Link, useHistory } from "react-router-dom"; // Dùng useHistory thay vì useNavigate
import convertMoney from "../convertMoney";

function Cart() {
  const token = useSelector((state) => state.Session.token); // Lấy token từ Redux
  const listCart = useSelector((state) => state.Cart.listCart); // Lấy danh sách giỏ hàng từ Redux
  const [cart, setCart] = useState(listCart); // State local để quản lý giỏ hàng
  const [total, setTotal] = useState(0); // Tổng tiền giỏ hàng
  const dispatch = useDispatch(); // Dispatch actions
  const history = useHistory(); // Hook để điều hướng trang

  // Hàm tính tổng tiền giỏ hàng
  const getTotal = (carts) => {
    let sub_total = 0;
    carts.forEach((item) => {
      sub_total += parseInt(item.priceProduct) * parseInt(item.count);
    });
    setTotal(sub_total);
  };

  // Lắng nghe sự thay đổi trong giỏ hàng (từ Redux)
  useEffect(() => {
    setCart(listCart);
    getTotal(listCart);
  }, [listCart]);

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const onDeleteCart = (productId) => {
    dispatch(deleteCart({ idProduct: productId }));
    alertify.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
  };

  // Cập nhật số lượng sản phẩm
  const onUpdateCount = (productId, count) => {
    dispatch(updateCart({ idProduct: productId, count }));
    alertify.success("Số lượng sản phẩm đã được cập nhật!");
  };

  // Hàm điều hướng đến trang Checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alertify.warning("Giỏ hàng của bạn hiện tại không có sản phẩm!");
    } else {
      history.push("/checkout"); // Sử dụng history.push thay vì navigate
    }
  };

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Cart</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Cart
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <h2 className="h5 text-uppercase mb-4">Shopping cart</h2>
        <div className="row">
          <div className="col-lg-8 mb-4 mb-lg-0">
            {/* Component hiển thị danh sách sản phẩm trong giỏ hàng */}
            <ListCart
              listCart={cart}
              onDeleteCart={onDeleteCart}
              onUpdateCount={onUpdateCount}
            />
            <div className="bg-light px-4 py-3">
              <div className="row align-items-center text-center">
                <div className="col-md-6 mb-3 mb-md-0 text-md-left">
                  <Link
                    className="btn btn-link p-0 text-dark btn-sm"
                    to="/shop"
                  >
                    <i className="fas fa-long-arrow-alt-left mr-2"> </i>
                    Continue shopping
                  </Link>
                </div>
                <div className="col-md-6 text-md-right">
                  {/* Khi người dùng nhấn vào nút này, sẽ điều hướng đến Checkout */}
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={proceedToCheckout}
                  >
                    Proceed to checkout
                    <i className="fas fa-long-arrow-alt-right ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 rounded-0 p-lg-4 bg-light">
              <div className="card-body">
                <h5 className="text-uppercase mb-4">Cart total</h5>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between py-3 border-bottom">
                    <strong className="text-uppercase small font-weight-bold">
                      Total
                    </strong>
                    <strong>{convertMoney(total)} VND</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
