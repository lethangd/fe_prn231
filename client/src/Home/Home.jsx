import React, { useEffect, useState } from "react";
import ProductAPI from "../API/ProductAPI";
import Image from "../Share/img/Image";
import convertMoney from "../convertMoney";
import { Link } from "react-router-dom";
import { Client } from "../api-client";

function Home(props) {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Thêm loading để xử lý trạng thái loading khi fetch
  const apiClient = new Client();
  // Fetch Product
  useEffect(() => {
    const fetchData = async () => {
      // Xây dựng các tham số cho API, ví dụ trang hiện tại và số sản phẩm mỗi trang
      const params = {
        pageNumber: 1, // Trang 1
        pageSize: 8, // Lấy 8 sản phẩm
        sortBy: "default", // Giả sử bạn muốn sắp xếp theo mặc định
        sortDirection: "asc", // Sắp xếp theo chiều tăng dần
      };

      try {
        const response = await apiClient.productGET(
          undefined,
          undefined,
          undefined,
          undefined,
          params.pageNumber,
          params.pageSize,
          params.sortBy,
          params.sortDirection
        );
        console.log(response);

        // Giả sử API trả về response có cấu trúc tương tự như sau:
        const { items, totalPages } = response;

        // Sau khi lấy dữ liệu từ API, lưu vào state
        setProducts(items); // Lưu sản phẩm
        setTotalPages(totalPages); // Lưu tổng số trang
        setLoading(false); // Dữ liệu đã được tải xong
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chạy một lần khi component mount

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
  }

  return (
    <div className="page-holder">
      <header className="header bg-white">
        <div className="container">
          <section
            className="hero pb-3 bg-cover bg-center d-flex align-items-center"
            style={{ backgroundImage: `url(${Image.banner})` }}
          >
            <div className="container py-5">
              <div className="row px-4 px-lg-5">
                <div className="col-lg-6">
                  <p className="text-muted small text-uppercase mb-2">
                    New Inspiration 2020
                  </p>
                  <h1 className="h2 text-uppercase mb-3">
                    20% off on new season
                  </h1>
                  <a className="btn btn-dark" href="./shop">
                    Browse collections
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-5">
            <header className="text-center">
              <p className="small text-muted small text-uppercase mb-1">
                Carefully created collections
              </p>
              <h2 className="h5 text-uppercase mb-4">Browse our categories</h2>
            </header>
            <div className="row">
              <div className="col-md-12 mb-4">
                <div className="row">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <Link className="category-item" to={"/shop?category=Phone"}>
                      <img className="img-fluid" src={Image.img1} alt="" />
                    </Link>
                  </div>
                  <div className="col-md-6 mb-4 mb-md-0">
                    <Link
                      className="category-item"
                      to={"/shop?category=Laptop"}
                    >
                      <img className="img-fluid" src={Image.img2} alt="" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-4 mb-4 mb-md-0">
                    <Link
                      className="category-item"
                      to={"/shop?category=Tablet"}
                    >
                      <img className="img-fluid" src={Image.img3} alt="" />
                    </Link>
                  </div>
                  <div className="col-md-4 mb-4 mb-md-0">
                    <Link
                      className="category-item"
                      to={"/shop?category=Accessories"}
                    >
                      <img className="img-fluid" src={Image.img4} alt="" />
                    </Link>
                  </div>
                  <div className="col-md-4 mb-4 mb-md-0">
                    <Link
                      className="category-item"
                      to={"/shop?category=Accessories"}
                    >
                      <img className="img-fluid" src={Image.img5} alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-5" id="section_product">
            <header>
              <p className="small text-muted small text-uppercase mb-1">
                Made the hard way
              </p>
              <h2 className="h5 text-uppercase mb-4">Top trending products</h2>
            </header>
            <div className="row">
              {products &&
                products.map((value) => (
                  <div
                    className="col-xl-3 col-lg-4 col-sm-6"
                    key={value.productId}
                  >
                    <div className="product text-center">
                      <div className="position-relative mb-3">
                        <div className="badge text-white badge-"></div>
                        <a
                          className="d-block"
                          href={`#product_${value.productId}`}
                          data-toggle="modal"
                        >
                          <img className="img-fluid" src={value.image} alt="" />
                        </a>
                        <div className="product-overlay">
                          <ul className="mb-0 list-inline">
                            {/* Add to cart or wishlist */}
                          </ul>
                        </div>
                      </div>
                      <h6>
                        <Link
                          className="reset-anchor"
                          to={`/detail/${value.productId}`}
                        >
                          {value.productName}
                        </Link>
                      </h6>
                      <p className="small text-muted">
                        {convertMoney(value.listPrice)} VND
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </header>
    </div>
  );
}

export default Home;
