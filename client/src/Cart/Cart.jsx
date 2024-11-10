// components/Cart.js
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ListCart from "./Component/ListCart";
import alertify from "alertifyjs";
import { Link, useHistory } from "react-router-dom";
import convertMoney from "../convertMoney";
import { Client } from "../api-client"; // Import NSwag-generated Client

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const apiClient = new Client();

  // Fetch cart data from server
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alertify.error("You need to log in to view your cart.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.cartsGET({
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response);
        calculateTotal(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError("Failed to load cart. Please try again.");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Calculate total cost
  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  // Handle item deletion from cart
  const onDeleteCart = async (productId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alertify.error("You need to log in to delete items from your cart.");
      return;
    }

    try {
      await apiClient.cartsDELETE(productId, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart((prevCart) => {
        const updatedCart = prevCart.filter(
          (item) => item.productId !== productId
        );
        calculateTotal(updatedCart);
        return updatedCart;
      });
      alertify.success("Product removed from cart.");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alertify.error("Failed to remove item from cart. Please try again.");
    }
  };

  // Navigate to Checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alertify.warning("Your cart is empty!");
    } else {
      history.push("/checkout");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

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
            <ListCart
              listCart={cart}
              onDeleteCart={onDeleteCart} // Pass down delete handler
              onUpdateCount={(productId, quantity) => {
                // Function to update quantity if needed
                setCart((prevCart) =>
                  prevCart.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item
                  )
                );
                calculateTotal(cart);
              }}
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
