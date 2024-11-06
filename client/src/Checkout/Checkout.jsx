import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import useSelector để lấy dữ liệu từ Redux
import queryString from "query-string";
import CheckoutAPI from "../API/CheckoutAPI";
import convertMoney from "../convertMoney";
import "./Checkout.css";

function Checkout(props) {
  // Lấy giỏ hàng từ Redux
  const carts = useSelector((state) => state.Cart.listCart);
  console.log("Carts:", carts);

  const [total, setTotal] = useState(0);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fullnameError, setFullnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);

  // Hàm tính tổng tiền trong giỏ hàng
  function getTotal(carts) {
    let sub_total = 0;
    carts.forEach((value) => {
      sub_total += parseInt(value.priceProduct) * parseInt(value.count);
    });
    setTotal(sub_total);
  }

  // Lắng nghe thay đổi trong giỏ hàng Redux
  useEffect(() => {
    if (carts.length > 0) {
      getTotal(carts);
    }
  }, [carts]);

  // Kiểm tra và xử lý khi người dùng nhấn "Place order"
  const handlerSubmit = async () => {
    if (!fullname || !email || !phone || !address) {
      if (!fullname) setFullnameError(true);
      if (!email) setEmailError(true);
      if (!phone) setPhoneError(true);
      if (!address) setAddressError(true);
      return;
    }

    // Gửi dữ liệu tạo đơn hàng
    const orderData = {
      token: localStorage.getItem("token"),
      nameReceiver: fullname,
      phoneReceiver: phone,
      addressReceiver: address,
      carts,
      payment: "COD", // Bạn có thể thay đổi tùy theo phương thức thanh toán
      items: carts.map((item) => ({
        productId: item.idProduct,
        quantity: item.count,
      })),
    };

    try {
      setLoad(true);

      // Gửi đơn hàng tới API
      const response = await CheckoutAPI.createOrder(orderData);
      console.log("Order created:", response);

      // Delay để hiển thị thông báo thành công
      setTimeout(() => {
        setSuccess(true);
        setLoad(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      setLoad(false);
    }
  };

  return (
    <div>
      {load && (
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

        {!success && (
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
                        onClick={handlerSubmit}
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
                      {carts &&
                        carts.map((value) => (
                          <div key={value.idProduct}>
                            <li className="d-flex align-items-center justify-content-between">
                              <strong className="small font-weight-bold">
                                {value.nameProduct}
                              </strong>
                              <br></br>
                              <span className="text-muted small">
                                {convertMoney(value.priceProduct)} VND x{" "}
                                {value.count}
                              </span>
                            </li>
                            <li className="border-bottom my-2"></li>
                          </div>
                        ))}
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
        )}

        {success && (
          <section className="py-5">
            <div className="p-5">
              <h1>You Have Successfully Ordered!</h1>
              <p style={{ fontSize: "1.2rem" }}>Please Check Your Email.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Checkout;
