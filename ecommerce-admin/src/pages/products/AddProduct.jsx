import * as Icons from "react-icons/tb";
import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import { Client } from "../api-client"; // NSwag-generated API client

const AddProduct = () => {
  const apiClient = new Client();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    modelNumber: "",
    description: "",
    specifications: "",
    warranty: "",
    coverImage: "",
    categoryId: 1,
  });

  const [categories, setCategories] = useState([]);
  const [createdProductId, setCreatedProductId] = useState(null);
  const [isVariantModalOpen, setVariantModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [variantData, setVariantData] = useState({
    sku: "",
    price: 0,
    attributes: "attributes",
  });
  const [imageData, setImageData] = useState({ imageUrl: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.categoryGET();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (key, value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [key]: value,
    }));
  };

  const handleSaveProduct = async () => {
    const createProductCommand = {
      ...product,
      isDeleted: false,
      createdAt: new Date(),
    };
    try {
      let idvt = await apiClient.productPOST(createProductCommand);
      setCreatedProductId(idvt); // Use ID from response if available
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleAddVariant = async () => {
    const createVariantCommand = {
      productId: createdProductId,
      ...variantData,
    };
    try {
      await apiClient.variantsPOST(createdProductId, createVariantCommand);
      alert("Variant added successfully!");
    } catch (error) {
      console.error("Error adding variant:", error);
    }
  };

  const handleAddImage = async () => {
    const addImageCommand = {
      variantId: variantData.variantId,
      imageUrl: imageData.imageUrl,
    };
    try {
      await apiClient.imagesPOST(addImageCommand.variantId, addImageCommand);
      alert("Image added successfully!");
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Add Product</h2>
              <Input
                type="text"
                placeholder="Enter the product name"
                label="Name"
                icon={<Icons.TbShoppingCart />}
                value={product.name}
                onChange={(value) => handleInputChange("name", value)}
              />
              <Input
                type="text"
                placeholder="Enter brand"
                label="Brand"
                value={product.brand}
                onChange={(value) => handleInputChange("brand", value)}
              />
              <Input
                type="text"
                placeholder="Enter model number"
                label="Model Number"
                value={product.modelNumber}
                onChange={(value) => handleInputChange("modelNumber", value)}
              />
              <TextEditor
                label="Description"
                placeholder="Enter a description"
                value={product.description}
                onChange={(value) => handleInputChange("description", value)}
              />
              <TextEditor
                label="Specifications"
                placeholder="Enter specifications"
                value={product.specifications}
                onChange={(value) => handleInputChange("specifications", value)}
              />
              <Input
                type="text"
                placeholder="Enter warranty info"
                label="Warranty"
                value={product.warranty}
                onChange={(value) => handleInputChange("warranty", value)}
              />
              <FileUpload
                onFileUpload={(url) => handleInputChange("coverImage", url)}
                label="Upload Cover Image"
              />

              {/* Replacing MultiSelect with regular <select> */}
              <div className="sidebar_item">
                <p>Category</p>
                <select
                  className="dropdown_placeholder"
                  value={product.categoryId}
                  onChange={(e) =>
                    handleInputChange("categoryId", Number(e.target.value))
                  }
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input_field">
                <Button
                  label="Save & Exit"
                  icon={<Icons.TbDeviceFloppy />}
                  onClick={handleSaveProduct}
                />
                <Button
                  label="Save"
                  icon={<Icons.TbCircleCheck />}
                  className="success"
                  onClick={handleSaveProduct}
                />
              </div>
              {createdProductId && (
                <div className="additional-options">
                  <Button
                    label="Add Variant"
                    icon={<Icons.TbPlus />}
                    onClick={() => setVariantModalOpen(true)}
                  />
                  <Button
                    label="Add Image"
                    icon={<Icons.TbPlus />}
                    onClick={() => setImageModalOpen(true)}
                  />
                </div>
              )}
            </div>

            {/* Variant and Image Modals */}
            <Modal
              bool={isVariantModalOpen}
              onClose={() => setVariantModalOpen(false)}
            >
              <div className="modal-head">
                <h2>Add Variant</h2>
              </div>
              <div className="modal-body">
                <Input
                  type="text"
                  placeholder="Enter SKU"
                  label="SKU"
                  value={variantData.sku}
                  onChange={(value) =>
                    setVariantData({ ...variantData, sku: value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Enter Price"
                  label="Price"
                  value={variantData.price}
                  onChange={(value) =>
                    setVariantData({ ...variantData, price: parseFloat(value) })
                  }
                />
                <Input
                  type="text"
                  placeholder="Enter Attributes"
                  label="Attributes"
                  value={variantData.attributes}
                  onChange={(value) =>
                    setVariantData({ ...variantData, attributes: value })
                  }
                />
              </div>
              <div className="modal-footer">
                <Button label="Save Variant" onClick={handleAddVariant} />
              </div>
            </Modal>

            <Modal
              bool={isImageModalOpen}
              onClose={() => setImageModalOpen(false)}
            >
              <div className="modal-head">
                <h2>Add Image</h2>
              </div>
              <div className="modal-body">
                <Input
                  type="text"
                  placeholder="Enter Image URL"
                  label="Image URL"
                  value={imageData.imageUrl}
                  onChange={(value) =>
                    setImageData({ ...imageData, imageUrl: value })
                  }
                />
              </div>
              <div className="modal-footer">
                <Button label="Save Image" onClick={handleAddImage} />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
