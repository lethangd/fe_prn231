import React, { useState, useEffect } from "react";
import ProductAPI from "../API/ProductAPI"; // Import ProductAPI

const NewProduct = () => {
  // State for form inputs
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(""); // The selected category
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [listPrice, setListPrice] = useState(""); // Price field
  const [discount, setDiscount] = useState(""); // Discount field
  const [files, setFiles] = useState(null); // Image files
  const [categories, setCategories] = useState([]); // To store fetched categories

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories"); // Adjust the API URL
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // Set the categories state with the fetched data
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run only on mount

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate price and discount values
    if (isNaN(listPrice) || isNaN(discount)) {
      alert("Please enter valid price and discount values.");
      return;
    }

    const formData = new FormData();
    formData.append("ProductName", productName);
    formData.append("Category", category);
    formData.append("ShortDescription", shortDescription);
    formData.append("LongDescription", longDescription);
    formData.append("ListPrice", listPrice);
    formData.append("Discount", discount);

    // Append files to FormData
    if (files) {
      Array.from(files).forEach((file, index) => {
        formData.append(`images[${index}]`, file); // Ensure files are added as 'images[0]', 'images[1]' etc.
      });
    }

    try {
      // Call the API to add the product (POST request)
      const response = await ProductAPI.createProduct(formData); // Use ProductAPI's createProduct method

      if (response && response.status === 201) {
        alert("Product added successfully");
        // Reset form fields after success
        setProductName("");
        setCategory("");
        setShortDescription("");
        setLongDescription("");
        setListPrice("");
        setDiscount("");
        setFiles(null);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <form
            style={{ width: "50%", marginLeft: "40px" }}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter Product Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.CategoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Enter Short Description"
                required
              />
            </div>
            <div className="form-group">
              <label>Long Description</label>
              <textarea
                className="form-control"
                rows="6"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Enter Long Description"
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="Enter Price"
                required
              />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input
                type="number"
                className="form-control"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Enter Discount"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUpload">Upload images (max 5)</label>
              <input
                type="file"
                className="form-control-file"
                id="imageUpload"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
