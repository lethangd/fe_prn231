import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import * as Icons from "react-icons/tb";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Button from "../../components/common/Button.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import RangeSlider from "../../components/common/RangeSlider.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import { Client } from "../api-client";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    category: null,
    priceRange: [0, 1000000],
  });
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const apiClient = new Client();

  const fetchProducts = async () => {
    try {
      const response = await apiClient.productGET(
        fields.name,
        fields.category ? fields.category.id : undefined,
        fields.priceRange[0],
        fields.priceRange[1],
        currentPage,
        10
      );
      setProducts(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoryList = await apiClient.categoryGET();
      setCategories(categoryList);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fields, currentPage]);

  const handleInputChange = (key, value) => {
    setFields((prevFields) => ({ ...prevFields, [key]: value }));
  };

  const handleSliderChange = (newValues) => {
    setFields((prevFields) => ({ ...prevFields, priceRange: newValues }));
  };

  const handleToggleOffcanvas = () => setIsOffcanvasOpen(!isOffcanvasOpen);

  const applyFilter = () => {
    fetchProducts();
    setIsOffcanvasOpen(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      products.map((product) => ({
        ID: product.id,
        Name: product.name,
        Price: product.price,
        Brand: product.brand,
        Stock_Status: product.isInStock ? "Out of Stock" : "In Stock",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "Products.xlsx");
  };

  return (
    <section className="products">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <Button
                label="Advance Filter"
                className="sm"
                icon={<Icons.TbFilter />}
                onClick={handleToggleOffcanvas}
              />
              <Input
                placeholder="Search Product by Name..."
                className="sm table_search"
                value={fields.name}
                onChange={(value) => handleInputChange("name", value)}
              />
              {/* Thêm nút Export Excel */}
              <Button
                label="Export Excel"
                className="sm"
                icon={<Icons.TbFileExport />}
                onClick={exportToExcel}
              />
            </div>

            <Offcanvas isOpen={isOffcanvasOpen} onClose={handleToggleOffcanvas}>
              <div className="offcanvas-head">
                <h2>Advanced Search</h2>
              </div>
              <div className="offcanvas-body">
                <div className="column">
                  <Input
                    type="text"
                    label="Product Name"
                    value={fields.name}
                    onChange={(value) => handleInputChange("name", value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="column">
                  <Dropdown
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                    placeholder="Select Category"
                    label="Category"
                    selectedValue={
                      fields.category ? { label: fields.category.name } : null
                    }
                    onClick={(selectedCategory) =>
                      handleInputChange("category", selectedCategory)
                    }
                  />
                </div>
                <div className="column">
                  <RangeSlider
                    label="Price Range"
                    values={fields.priceRange}
                    onValuesChange={handleSliderChange}
                  />
                </div>
              </div>
              <div className="offcanvas-footer">
                <Button label="Apply Filter" onClick={applyFilter} />
              </div>
            </Offcanvas>

            <div className="content_body">
              <table className="table_responsive">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Stock Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          width="50"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.brand}</td>
                      <td>{product.isInStock ? "Out of Stock" : "In Stock"}</td>
                      <td>
                        <TableAction
                          actionItems={["Edit", "Delete"]}
                          onActionItemClick={async (action) => {
                            if (action === "Edit") {
                              navigate(`/catalog/product/manage/${product.id}`);
                            } else if (action === "Delete") {
                              try {
                                await apiClient.productDELETE(product.id);
                                fetchProducts();
                              } catch (error) {
                                console.error("Error deleting product:", error);
                              }
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageProduct;
