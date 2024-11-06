import React, { useEffect, useState } from "react";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import CategoryAPI from "../API/CategoryAPI"; // Giả sử bạn đã có API này
import { Link } from "react-router-dom";
import Search from "./Component/Search";
import Pagination from "./Component/Pagination";
import Products from "./Component/Products";
import SortProduct from "./Component/SortProduct";
import convertMoney from "../convertMoney";

function Shop(props) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [temp, setTemp] = useState([]);
  const [sort, setSort] = useState("default");
  const [totalPage, setTotalPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    count: 9,
    search: "",
    categoryId: null, // categoryId thay vì category
    sortBy: "default",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await CategoryAPI.getCategories();
      setCategories(response);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTotalProducts = async () => {
      const params = {
        pageIndex: pagination.page,
        pageSize: pagination.count,
        sortBy: pagination.sortBy,
        searchTerm: pagination.search,
        categoryId: pagination.categoryId, // Lọc theo categoryId
      };

      const response = await ProductAPI.getAPI(params);

      const totalPages = Math.ceil(response.totalCount / pagination.count);
      setTotalPage(totalPages);
    };

    fetchTotalProducts();
  }, [pagination]);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        pageIndex: pagination.page,
        pageSize: pagination.count,
        sortBy: pagination.sortBy,
        searchTerm: pagination.search,
        categoryId: pagination.categoryId, // Lọc theo categoryId
      };

      const response = await ProductAPI.getAPI(params);

      setProducts(response.items);
    };

    fetchData();
  }, [pagination]);

  const handlerChangeSort = (value) => {
    setSort(value);
    setPagination({
      ...pagination,
      sortBy: value,
    });
  };

  const handlerChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });
  };

  const handlerSearch = (value) => {
    setPagination({
      ...pagination,
      search: value,
    });
  };

  const handlerCategory = (categoryId) => {
    setPagination({
      ...pagination,
      categoryId: categoryId, // Cập nhật categoryId
    });
  };

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Shop</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Shop
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container p-0">
          <div className="row">
            <div className="col-lg-3 order-2 order-lg-1">
              <h5 className="text-uppercase mb-4">Categories</h5>
              <ul className="list-unstyled small text-muted pl-lg-4 font-weight-normal">
                <li className="mb-2">
                  <a
                    className="reset-anchor"
                    href="#"
                    onClick={() => handlerCategory(null)} // All
                  >
                    All
                  </a>
                </li>
                {categories.map((category) => (
                  <li className="mb-2" key={category.categoryId}>
                    <a
                      className="reset-anchor"
                      href="#"
                      onClick={() => handlerCategory(category.categoryId)} // Lọc theo categoryId
                    >
                      {category.categoryName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-9 order-1 order-lg-2 mb-5 mb-lg-0">
              <div className="row mb-3 align-items-center">
                <Search handlerSearch={handlerSearch} />
                <div className="col-lg-8">
                  <ul className="list-inline d-flex align-items-center justify-content-lg-end mb-0">
                    <li className="list-inline-item">
                      <SortProduct handlerChangeSort={handlerChangeSort} />
                    </li>
                  </ul>
                </div>
              </div>

              <Products products={products} sort={sort} />
              <Pagination
                pagination={pagination}
                handlerChangePage={handlerChangePage}
                totalPage={totalPage}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Shop;
