import React, { useState, useEffect } from "react";
import alertify from "alertifyjs";
import { Client, CreateOrderCommand, OrderItemDTO } from "../api-client";
import convertMoney from "../convertMoney";
import "./Checkout.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function Checkout() {
  const [carts, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fullnameError, setFullnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const apiClient = new Client();
  const history = useHistory();

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
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handleSubmit = async () => {
    const orderItems = carts.map(
      (item) =>
        new OrderItemDTO({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })
    );

    const orderData = new CreateOrderCommand({ items: orderItems });

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alertify.error("You need to log in to place an order.");
      return;
    }

    try {
      setLoading(true);
      await apiClient.orderPOST(orderData);

      // Delete each item in the cart after a successful order
      for (const item of carts) {
        await apiClient.cartsDELETE(item.productVariantId);
      }

      // Clear cart state and mark success
      setCart([]);
      setTotal(0);
      setSuccess(true);
      setLoading(false);
      history.push("/history");
    } catch (error) {
      console.error("Error creating order:", error);
      alertify.error("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}

      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
            </div>
          </div>
        </section>

        {!success ? (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>
            <div className="row">
              <div className="col-lg-8">
                <form>
                  <div className="row">
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Fullname"
                      >
                        Full Name:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        type="text"
                        placeholder="Enter Your Full Name Here!"
                      />
                      {fullnameError && (
                        <span className="text-danger">
                          * Please Check Your Full Name!
                        </span>
                      )}
                    </div>
                    {/* Additional form fields for email, phone, and address */}
                    {/* Submit Button */}
                    <div className="col-lg-12 form-group">
                      <button
                        className="btn btn-dark"
                        style={{ color: "white" }}
                        type="button"
                        onClick={handleSubmit}
                      >
                        Place order
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <ul className="list-unstyled mb-0">
                      {carts.map((item) => (
                        <li
                          key={`${item.productId}-${item.productVariantId}`}
                          className="d-flex align-items-center justify-content-between"
                        >
                          <strong className="small font-weight-bold">
                            {item.productName}
                          </strong>
                          <span className="text-muted small">
                            {convertMoney(item.price)} VND x {item.quantity}
                          </span>
                        </li>
                      ))}
                      <li className="border-bottom my-2"></li>
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>
                        <span>{convertMoney(total)} VND</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-5">
            <div className="p-5">
              <h1>Your order was successful!</h1>
              <p style={{ fontSize: "1.2rem" }}>
                Please check your email for confirmation.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Checkout;
