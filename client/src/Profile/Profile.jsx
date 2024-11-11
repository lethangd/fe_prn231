import React, { useState, useEffect } from 'react';
import { Client } from "../api-client";
import alertify from "alertifyjs";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const apiClient = new Client();

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alertify.error("Vui lòng đăng nhập để xem thông tin");
        return;
      }

      const response = await apiClient.profileGET();
      setUser(response);
      const fullName = `${response.firstName || ''} ${response.lastName || ''}`.trim();
      setFormData({
        ...formData,
        fullName: fullName,
        email: response.email || '',
        phoneNumber: response.phoneNumber || ''
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      alertify.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.addressesGET();
      setAddresses(response || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alertify.error("Không thể tải danh sách địa chỉ");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alertify.error("Mật khẩu mới không khớp!");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      await apiClient.userPUT(updateData);
      alertify.success("Cập nhật thông tin thành công!");
      setEditMode(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating user data:", error);
      alertify.error("Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await apiClient.addressesDELETE(addressId);
      alertify.success("Xóa địa chỉ thành công!");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      alertify.error("Không thể xóa địa chỉ");
    }
  };

  if (loading) {
    return (
      <div className="wrapper_loader">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img 
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" 
                  alt="avatar"
                  className="rounded-circle img-fluid" 
                  style={{ width: '150px' }}
                />
                <h5 className="my-3">{user?.firstName} {user?.lastName}</h5>
                <p className="text-muted mb-1">{user?.email}</p>
                <p className="text-muted mb-4">{user?.phoneNumber}</p>
                <div className="d-flex justify-content-center mb-2">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Hủy' : 'Chỉnh sửa'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                {editMode ? (
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label className="mb-0">Họ</label>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label className="mb-0">Tên</label>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label className="mb-0">Email</label>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label className="mb-0">Số điện thoại</label>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="tel"
                          className="form-control"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label className="mb-0">Mật khẩu hiện tại</label>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          className="form-control"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label className="mb-0">Mật khẩu mới</label>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          className="form-control"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <label className="mb-0">Xác nhận mật khẩu</label>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 text-end">
                        <button type="submit" className="btn btn-primary">
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <p className="mb-0">Họ và tên</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{user?.firstName} {user?.lastName}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <p className="mb-0">Email</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{user?.email}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <p className="mb-0">Số điện thoại</p>
                      </div>
                      <div className="col-sm-9">
                        <p className="text-muted mb-0">{user?.phoneNumber}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Địa chỉ của tôi</h5>
                {addresses.map((address) => (
                  <div key={address.id} className="address-item mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{address.receiverName}</h6>
                        <p className="mb-1">{address.phoneNumber}</p>
                        <p className="mb-0 text-muted">
                          {address.addressDetail}, {address.ward}, {address.district}, {address.city}
                        </p>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 