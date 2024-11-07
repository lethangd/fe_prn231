import React, { useEffect, useState } from "react";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import Pagination from "./Component/Pagination";

function Products(props) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: "1",
    count: "8",
    search: "",
    category: "all",
  });
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null); // State for the selected file
  const [totalPage, setTotalPage] = useState(1);

  // Pagination handler for search input
  const onChangeText = (e) => {
    const value = e.target.value;
    setPagination({
      ...pagination,
      search: value,
    });
  };

  // Handler to change page in pagination
  const handlerChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });
  };

  // Fetch total product count to calculate total pages
  useEffect(() => {
    const fetchAllData = async () => {
      const response = await ProductAPI.getAPI();
      const totalPage = Math.ceil(
        response.totalCount / parseInt(pagination.count)
      );
      setTotalPage(totalPage);
    };

    fetchAllData();
  }, [pagination]);

  // Fetch paginated product data based on pagination state
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: pagination.page,
        count: pagination.count,
        search: pagination.search,
        category: pagination.category,
      };
      const query = queryString.stringify(params);
      const newQuery = "?" + query;
      const response = await ProductAPI.getPagination(newQuery);
      setProducts(response.items); // Updated to handle 'items' from the response
    };

    fetchData();
  }, [pagination]);

  // Handle exporting products to Excel
  const handleExportToExcel = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products/export",
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${localStorage.getItem("tokena")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export products to Excel");
      }

      // Create a Blob from the response and trigger a download
      const blob = await response.blob();
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "Products.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the selected file
    }
  };

  // Handle importing the Excel file
  const handleImport = async () => {
    if (!file) {
      alert("Please select a file to import.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/products/import",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokena")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Products imported successfully.");
        // Optionally, you can refresh the product list after importing
        setPagination({
          ...pagination,
          page: "1", // Reset to first page
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to import: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error importing file:", error);
      alert("Error importing products.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Products List
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-muted">
                      Home
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Table
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Products</h4>

                {/* Export Button */}
                <button
                  className="btn btn-primary mb-3"
                  onClick={handleExportToExcel}
                >
                  Export to Excel
                </button>

                {/* Import Button and File Input */}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="mb-3"
                />
                <button className="btn btn-success mb-3" onClick={handleImport}>
                  Import Products
                </button>

                <input
                  className="form-control w-25"
                  onChange={onChangeText}
                  type="text"
                  placeholder="Search Products"
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products &&
                        products.map((product) => (
                          <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>{product.listPrice.toLocaleString()} VND</td>
                            <td>
                              <img
                                src={product.image}
                                alt={product.productName}
                                style={{ height: "60px", width: "60px" }}
                              />
                            </td>
                            <td>
                              {product.category ? product.category : "N/A"}
                            </td>
                            <td>
                              <a
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-success"
                              >
                                Update
                              </a>
                              &nbsp;
                              <a
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-danger"
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <Pagination
                    pagination={pagination}
                    handlerChangePage={handlerChangePage}
                    totalPage={totalPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer text-center text-muted"></footer>
    </div>
  );
}

export default Products;
