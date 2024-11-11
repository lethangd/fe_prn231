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
import { Client } from "../api-client"; // Import the NSwag-generated API client

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
  const navigate = useNavigate();

  const apiClient = new Client();

  // Fetch products based on filters
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
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const categoryList = await apiClient.categoryGET(); // Assuming categoryGET fetches all categories
      setCategories(categoryList);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, []);

  useEffect(() => {
    fetchProducts(); // Refetch products when filters change
  }, [fields, currentPage]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setFields((prevFields) => ({ ...prevFields, [key]: value }));
  };

  // Handle range slider change
  const handleSliderChange = (newValues) => {
    setFields((prevFields) => ({ ...prevFields, priceRange: newValues }));
  };

  // Toggle advanced filter offcanvas
  const handleToggleOffcanvas = () => setIsOffcanvasOpen(!isOffcanvasOpen);

  // Apply filter and close the offcanvas
  const applyFilter = () => {
    fetchProducts();
    setIsOffcanvasOpen(false);
  };

  return (
    <section className="products">
      <div className="container">
        <div className="wrapper">
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
          </div>

          {/* Offcanvas for Advanced Search */}
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

          {/* Products Table */}
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
                      <img src={product.image} alt={product.name} width="50" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.brand}</td>
                    <td>{product.inStock ? "In Stock" : "Out of Stock"}</td>
                    <td>
                      <TableAction
                        actionItems={["Edit", "Delete"]}
                        onActionItemClick={(action) => {
                          if (action === "Edit")
                            navigate(`/catalog/product/manage/${product.id}`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </section>
  );
};

export default ManageProduct;
