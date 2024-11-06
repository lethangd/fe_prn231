import React, { useState } from "react";
import ProductAPI from "../API/ProductAPI"; // Import ProductAPI

const NewProduct = () => {
  // State for form inputs
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [files, setFiles] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("category", category);
    formData.append("shortDescription", shortDescription);
    formData.append("longDescription", longDescription);

    // Append files to FormData
    if (files) {
      Array.from(files).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

    try {
      // Call the API to add the product (POST request)
      const response = await ProductAPI.createProduct(formData); // Use ProductAPI's createProduct method

      if (response) {
        alert("Product added successfully");
        // Reset form fields after success
        setProductName("");
        setCategory("");
        setShortDescription("");
        setLongDescription("");
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
              <input
                type="text"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter Category"
                required
              />
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
              <label htmlFor="imageUpload">Upload image (5 images)</label>
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
