import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Client } from "../api-client"; // Import your NSwag-generated Client
import queryString from "query-string";
import Search from "./Component/Search";
import Pagination from "./Component/Pagination";
import Products from "./Component/Products";
import SortProduct from "./Component/SortProduct";
import convertMoney from "../convertMoney";

function Shop(props) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("default");
  const [totalPage, setTotalPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    count: 9,
    search: "",
    categoryId: null, // categoryId thay vì category
    sortBy: "default",
  });

  // Initialize the NSwag Client
  const apiClient = new Client();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.categoryGET(); // Use NSwag categoryGET method
        setCategories(response); // Assuming response is an array of categories
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products count (total pages) based on pagination state
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const response = await apiClient.productGET(
          pagination.search,
          pagination.categoryId,
          undefined, // minPrice (can be set to something dynamic if needed)
          undefined, // maxPrice (can be set to something dynamic if needed)
          pagination.page,
          pagination.count,
          pagination.sortBy,
          undefined // sortDirection (can be set to something dynamic if needed)
        );
        const totalPages = Math.ceil(
          response.totalItemsCount / pagination.count
        );
        setTotalPage(totalPages);
      } catch (error) {
        console.error("Failed to fetch total products:", error);
      }
    };

    fetchTotalProducts();
  }, [pagination]);

  // Fetch products based on pagination state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.productGET(
          pagination.search,
          pagination.categoryId,
          undefined, // minPrice
          undefined, // maxPrice
          pagination.page,
          pagination.count,
          pagination.sortBy,
          undefined // sortDirection
        );
        setProducts(response.items); // Assuming 'items' contains the products
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchData();
  }, [pagination]);

  // Handle sort changes
  const handlerChangeSort = (value) => {
    setSort(value);
    setPagination({
      ...pagination,
      sortBy: value,
    });
  };

  // Handle page changes
  const handlerChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });
  };

  // Handle search changes
  const handlerSearch = (value) => {
    setPagination({
      ...pagination,
      search: value,
    });
  };

  // Handle category selection
  const handlerCategory = (categoryId) => {
    setPagination({
      ...pagination,
      categoryId: categoryId, // Update category filter
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
                    onClick={() => handlerCategory(null)} // All categories
                  >
                    All
                  </a>
                </li>
                {categories.map((category) => (
                  <li className="mb-2" key={category.id}>
                    <a
                      className="reset-anchor"
                      href="#"
                      onClick={() => handlerCategory(category.id)} // Filter by categoryId
                    >
                      {category.name}
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
