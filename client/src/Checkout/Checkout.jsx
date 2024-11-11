import React, { useState, useEffect } from "react";
import alertify from "alertifyjs";
import { Client, CreateOrderCommand, OrderItemDTO } from "../api-client";
import convertMoney from "../convertMoney";
import "./Checkout.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function Checkout() {
  const [carts, setCart] = useState([]);
  const [total, setTotal] = useState({ originalTotal: 0, saleTotal: 0 });
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [fullnameError, setFullnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [wardError, setWardError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Mặc định là COD

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

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await apiClient.addressesGET();
        if (response) {
          setAddresses(response);
          if (response.length > 0) {
            setSelectedAddressId(response[0].id);
          }
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        alertify.error("Failed to load addresses");
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
        const data = await response.json();
        if (data.error === 0) {
          setProvinces(data.data);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setCity(e.target.options[e.target.selectedIndex].text);
    
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
      const data = await response.json();
      if (data.error === 0) {
        setDistricts(data.data);
        setSelectedDistrict("");
        setSelectedWard("");
        setWards([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setDistrict(e.target.options[e.target.selectedIndex].text);

    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const data = await response.json();
      if (data.error === 0) {
        setWards(data.data);
        setSelectedWard("");
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
    setWard(e.target.options[e.target.selectedIndex].text);
  };

  const calculateTotal = (cartItems) => {
    const totals = cartItems.reduce(
      (acc, item) => {
        const originalTotal = item.price * item.quantity;
        const saleTotal = item.salePrice ? item.salePrice * item.quantity : originalTotal;
        
        return {
          originalTotal: acc.originalTotal + originalTotal,
          saleTotal: acc.saleTotal + saleTotal,
        };
      },
      { originalTotal: 0, saleTotal: 0 }
    );
    
    setTotal(totals);
  };

  const handleSubmit = async () => {
    // Kiểm tra xem đã chọn địa chỉ chưa
    if (!selectedAddressId) {
      alertify.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    // Lấy thông tin địa chỉ đã chọn
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      alertify.error("Không tìm thấy thông tin địa chỉ!");
      return;
    }

    // Tạo danh sách items từ giỏ hàng
    const orderItems = carts.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.salePrice || item.price
    }));

    // Tạo object order
    const orderData = {
      receiverName: selectedAddress.receiverName,
      phoneNumber: selectedAddress.phoneNumber,
      addressDetail: selectedAddress.addressDetail,
      ward: selectedAddress.ward,
      district: selectedAddress.district,
      city: selectedAddress.city,
      items: orderItems,
      paymentMethod: paymentMethod
    };

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alertify.error("Bạn cần đăng nhập để đặt hàng!");
      return;
    }

    try {
      setLoading(true);
      // Tạo đơn hàng
      const response = await fetch('https://localhost:7097/api/Order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Không thể tạo đơn hàng');
      }

      // Đọc response body
      const orderResponse = await response.text(); // Vì response là một số nên dùng text() thay vì json()
      console.log("Order Response:", orderResponse);

      // await new Promise(resolve => setTimeout(resolve, 3000));

      if (paymentMethod === 'vnpay') {
        try {
          if (!orderResponse) {
            throw new Error('Không nhận được mã đơn hàng');
          }

          const paymentResponse = await fetch('https://localhost:7097/api/Payment/create-payment-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              orderId: orderResponse, // Sử dụng trực tiếp orderResponse vì nó đã là ID
              amount: total.saleTotal
            })
          });

          if (!paymentResponse.ok) {
            const errorData = await paymentResponse.json();
            throw new Error(errorData.message || 'Không thể tạo URL thanh toán');
          }

          const { paymentUrl } = await paymentResponse.json();
          
          // Xóa giỏ hàng trước khi chuyển hướng
          for (const item of carts) {
            await apiClient.cartsDELETE(item.id);
          }

          // Chuyển hướng đến trang thanh toán VNPay
          if (paymentUrl) {
            window.location.href = paymentUrl;
            return;
          } else {
            throw new Error('URL thanh toán không hợp lệ');
          }
        } catch (error) {
          console.error("Error creating payment URL:", error);
          alertify.error(error.message || "Không thể tạo URL thanh toán. Vui lòng thử lại!");
          setLoading(false);
          return;
        }
      }

      // Nếu là COD, xử lý như bình thường
      for (const item of carts) {
        await apiClient.cartsDELETE(item.id);
      }

      setCart([]);
      setTotal({ originalTotal: 0, saleTotal: 0 });
      setSuccess(true);
      setLoading(false);
      alertify.success("Đặt hàng thành công!");
      history.push("/history");
    } catch (error) {
      console.error("Error creating order:", error);
      alertify.error("Đặt hàng thất bại. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  // Thêm hàm xử lý thêm địa chỉ mới
  const handleAddNewAddress = async () => {
    // Reset errors
    setFullnameError(false);
    setPhoneError(false);
    setCityError(false);
    setDistrictError(false);
    setWardError(false);
    setAddressError(false);

    // Validate
    let isValid = true;
    if (!fullname.trim()) {
      setFullnameError(true);
      isValid = false;
    }
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone)) {
      setPhoneError(true);
      isValid = false;
    }
    if (!city.trim()) {
      setCityError(true);
      isValid = false;
    }
    if (!district.trim()) {
      setDistrictError(true);
      isValid = false;
    }
    if (!ward.trim()) {
      setWardError(true);
      isValid = false;
    }
    if (!address.trim()) {
      setAddressError(true);
      isValid = false;
    }

    if (!isValid) {
      alertify.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const newAddress = {
        receiverName: fullname,
        phoneNumber: phone,
        addressDetail: address,
        ward: ward,
        district: district,
        city: city
      };

      await apiClient.addressesPOST(newAddress);
      alertify.success("Thêm địa chỉ mới thành công!");
      
      // Reset form
      setFullname("");
      setPhone("");
      setAddress("");
      setWard("");
      setDistrict("");
      setCity("");
      setShowAddNewAddress(false);

      // Reload addresses
      const response = await apiClient.addressesGET();
      if (response) {
        setAddresses(response);
        if (response.length > 0) {
          setSelectedAddressId(response[response.length - 1].id); // Select newly added address
        }
      }
    } catch (error) {
      console.error("Error adding new address:", error);
      alertify.error("Không thể thêm địa chỉ mới. Vui lòng thử lại!");
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
        <section className="bg-light">
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
                    {Array.isArray(addresses) && addresses.length > 0 ? (
                      <>
                        <div className="col-12 mb-4">
                          <h5 className="text-uppercase mb-3">Chọn địa chỉ giao hàng</h5>
                          <div className="addresses-list">
                            {addresses.map((address) => (
                              <div 
                                key={address.id}
                                className={`address-card p-3 mb-3 border rounded ${
                                  selectedAddressId === address.id ? 'border-primary' : ''
                                }`}
                                onClick={() => setSelectedAddressId(address.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">{address.receiverName}</h6>
                                    <p className="mb-1">{address.phoneNumber}</p>
                                    <p className="mb-0 text-muted">
                                      {address.addressDetail}, {address.ward}, {address.district}, {address.city}
                                    </p>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      type="radio"
                                      className="form-check-input"
                                      checked={selectedAddressId === address.id}
                                      onChange={() => setSelectedAddressId(address.id)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-primary mt-3"
                            onClick={() => setShowAddNewAddress(true)}
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm địa chỉ mới
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="col-12 mb-4">
                        <div className="alert alert-warning">
                          <p className="mb-0">Bạn chưa có địa chỉ giao hàng nào.</p>
                          <button
                            type="button"
                            className="btn btn-primary mt-3"
                            onClick={() => setShowAddNewAddress(true)}
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Thêm địa chỉ mới
                          </button>
                        </div>
                      </div>
                    )}

                    {showAddNewAddress && (
                      <div className="col-12 mt-5 mb-5">
                        <h5 className="text-uppercase mb-3">Thêm địa chỉ mới</h5>
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <label>Họ và tên người nhận</label>
                            <input
                              className={`form-control ${fullnameError ? 'is-invalid' : ''}`}
                              type="text"
                              value={fullname}
                              onChange={(e) => setFullname(e.target.value)}
                            />
                            {fullnameError && <div className="invalid-feedback">Vui lòng nhập họ tên!</div>}
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Số điện thoại</label>
                            <input
                              className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                            {phoneError && <div className="invalid-feedback">Vui lòng nhập số điện thoại hợp lệ!</div>}
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Tỉnh/Thành phố</label>
                            <select
                              className={`form-control ${cityError ? 'is-invalid' : ''}`}
                              value={selectedProvince}
                              onChange={handleProvinceChange}
                            >
                              <option value="">Chọn Tỉnh/Thành phố</option>
                              {provinces.map(province => (
                                <option key={province.id} value={province.id}>
                                  {province.full_name}
                                </option>
                              ))}
                            </select>
                            {cityError && <div className="invalid-feedback">Vui lòng chọn tỉnh/thành phố!</div>}
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Quận/Huyện</label>
                            <select
                              className={`form-control ${districtError ? 'is-invalid' : ''}`}
                              value={selectedDistrict}
                              onChange={handleDistrictChange}
                              disabled={!selectedProvince}
                            >
                              <option value="">Chọn Quận/Huyện</option>
                              {districts.map(district => (
                                <option key={district.id} value={district.id}>
                                  {district.full_name}
                                </option>
                              ))}
                            </select>
                            {districtError && <div className="invalid-feedback">Vui lòng chọn quận/huyện!</div>}
                          </div>
                          <div className="col-md-4 form-group">
                            <label>Phường/Xã</label>
                            <select
                              className={`form-control ${wardError ? 'is-invalid' : ''}`}
                              value={selectedWard}
                              onChange={handleWardChange}
                              disabled={!selectedDistrict}
                            >
                              <option value="">Chọn Phường/Xã</option>
                              {wards.map(ward => (
                                <option key={ward.id} value={ward.id}>
                                  {ward.full_name}
                                </option>
                              ))}
                            </select>
                            {wardError && <div className="invalid-feedback">Vui lòng chọn phường/xã!</div>}
                          </div>
                          <div className="col-12 form-group">
                            <label>Địa chỉ chi tiết</label>
                            <textarea
                              className={`form-control ${addressError ? 'is-invalid' : ''}`}
                              rows="3"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            ></textarea>
                            {addressError && <div className="invalid-feedback">Vui lòng nhập địa chỉ chi tiết!</div>}
                          </div>
                          <div className="col-12">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleAddNewAddress}
                            >
                              Thêm địa chỉ
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary ml-2"
                              onClick={() => setShowAddNewAddress(false)}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-12 mb-4">
                      <h5 className="text-uppercase mb-3">Phương thức thanh toán</h5>
                      <div className="payment-methods">
                        <div className="form-check mb-3">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="cod">
                            <i className="fas fa-money-bill-wave me-2"></i>
                            Thanh toán khi nhận hàng (COD)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="vnpay"
                            name="paymentMethod"
                            value="vnpay"
                            checked={paymentMethod === 'vnpay'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="vnpay">
                            <i className="fas fa-credit-card me-2"></i>
                            Thanh toán qua VNPay
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 form-group">
                      <button
                        className="btn btn-dark"
                        style={{ color: "white" }}
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedAddressId && !showAddNewAddress}
                      >
                        Đặt hàng
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <div className="order-items">
                      {carts.map((item) => (
                        <div key={`${item.productId}-${item.productVariantId}`} 
                             className="card mb-3 border-0 shadow-sm">
                          <div className="row g-0 p-2">
                          
                            <div className="col-4 d-flex align-items-center">
                              <img 
                                src={item.image} 
                                alt={item.productName}
                                className="img-fluid rounded"
                                style={{ objectFit: 'cover', height: '80px', width: '100%' }}
                              />
                            </div>
                            <div className="col-8">
                              <div className="card-body p-2">
                                <h6 className="card-title mb-1">{item.productName}</h6>
                                <p className="card-text mb-1">
                                  {item.attributes}
                                </p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    {item.salePrice ? (
                                      <>
                                        <del className="text-muted me-2">
                                          <small>{convertMoney(item.price)} VND</small>
                                        </del>
                                        <div className="text-success">
                                          {convertMoney(item.salePrice)} VND
                                        </div>
                                      </>
                                    ) : (
                                      <span>{convertMoney(item.price)} VND</span>
                                    )}
                                  </div>
                                  <span className="badge text-white bg-secondary">x{item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-top pt-4 mt-4">
                      {total.originalTotal !== total.saleTotal && (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Original Total:</span>
                            <span className="text-muted text-decoration-line-through">
                              {convertMoney(total.originalTotal)} VND
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2 text-success">
                            <span>Save:</span>
                            <span>{convertMoney(total.originalTotal - total.saleTotal)} VND</span>
                          </div>
                        </>
                      )}
                      <div className="d-flex justify-content-between mt-3">
                        <strong className="text-uppercase">Total:</strong>
                        <strong className="text-danger">{convertMoney(total.saleTotal)} VND</strong>
                      </div>
                    </div>
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
