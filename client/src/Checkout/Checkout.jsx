// components/Checkout.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import alertify from "alertifyjs";
import { Client, CreateOrderCommand } from "../api-client"; // Import NSwag-generated Client
import convertMoney from "../convertMoney";
import "./Checkout.css";

function Checkout() {
  // Retrieve cart items from Redux
  const carts = useSelector((state) => state.Cart.listCart);

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

  // Calculate total price of items in cart
  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = carts.reduce(
        (sum, item) => sum + item.priceProduct * item.count,
        0
      );
      setTotal(totalAmount);
    };

    if (carts.length > 0) calculateTotal();
  }, [carts]);

  // Handle form validation and order submission
  const handleSubmit = async () => {
    // Form validation
    if (!fullname || !email || !phone || !address) {
      if (!fullname) setFullnameError(true);
      if (!email) setEmailError(true);
      if (!phone) setPhoneError(true);
      if (!address) setAddressError(true);
      return;
    }

    // Prepare order items in the required format
    const orderItems = carts.map((item) => ({
      productId: item.idProduct,
      quantity: item.count,
    }));

    // Create the order command
    const orderData = new CreateOrderCommand({
      items: orderItems,
    });

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alertify.error("You need to log in to place an order.");
      return;
    }

    try {
      setLoading(true);

      // Send the order request with the token in headers
      await apiClient.orderPOST(orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Order successful
      setSuccess(true);
      setLoading(false);
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
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Email"
                      >
                        Email:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        placeholder="Enter Your Email Here!"
                      />
                      {emailError && (
                        <span className="text-danger">
                          * Please Check Your Email!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Phone"
                      >
                        Phone Number:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        placeholder="Enter Your Phone Number Here!"
                      />
                      {phoneError && (
                        <span className="text-danger">
                          * Please Check Your Phone Number!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Address"
                      >
                        Address:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        placeholder="Enter Your Address Here!"
                      />
                      {addressError && (
                        <span className="text-danger">
                          * Please Check Your Address!
                        </span>
                      )}
                    </div>
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
                          key={item.idProduct}
                          className="d-flex align-items-center justify-content-between"
                        >
                          <strong className="small font-weight-bold">
                            {item.nameProduct}
                          </strong>
                          <span className="text-muted small">
                            {convertMoney(item.priceProduct)} VND x {item.count}
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
