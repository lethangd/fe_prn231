import * as Icons from "react-icons/tb";
import { useState, useEffect } from "react";
import { Client, CreateCategoryCommand } from "../api-client";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";

const ManageCategories = () => {
  const apiClient = new Client();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: undefined,
    parentId: undefined,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.categoryGET();
      setCategories(response); // Assuming `categoryGET` returns an array of categories
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setNewCategory((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveCategory = async () => {
    const newCategoryCommand = new CreateCategoryCommand({
      name: newCategory.name,
      description: newCategory.description,
      parentId: newCategory.parentId, // Set parentId if applicable
    });

    try {
      await apiClient.categoryPOST(newCategoryCommand);
      alert("Category created successfully!");
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <section className="categories">
      <div className="container">
        <div className="wrapper">
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Add Category</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the category name"
                  label="Name"
                  value={newCategory.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
              </div>
              <div className="column">
                <Textarea
                  placeholder="Description"
                  label="Description"
                  value={newCategory.description}
                  onChange={(value) => handleInputChange("description", value)}
                />
              </div>
              <Divider />

              {/* Replacing MultiSelect with a standard <select> */}
              <div className="column">
                <p>Parent Category</p>
                <select
                  className="dropdown_placeholder mt-2"
                  value={newCategory.parentId || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "parentId",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <Divider />
              <Button label="Discard" className="right outline" />
              <Button label="Save" onClick={handleSaveCategory} />
            </div>
          </div>

          {/* Category List */}
          <div className="content transparent">
            <div className="content_head">
              <Dropdown
                placeholder="Bulk Action"
                className="sm"
                options={[{ value: "delete", label: "Delete" }]}
              />
              <Input
                placeholder="Search Categories..."
                className="sm table_search"
              />
              <div className="btn_parent">
                <Link to="/catalog/category/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Categories</span>
                </Link>
              </div>
            </div>

            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_checkbox">
                        <CheckBox isChecked={bulkCheck} />
                      </th>
                      <th className="td_id">ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="td_checkbox">
                          <CheckBox
                            isChecked={specificChecks[category.id] || false}
                          />
                        </td>
                        <td className="td_id">{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td>{category.isFeatured ? "Yes" : "No"}</td>
                        <td className="td_action">
                          <TableAction
                            actionItems={["Edit", "Delete"]}
                            onActionItemClick={(action) => {
                              if (action === "Edit")
                                navigate(
                                  `/catalog/categories/edit/${category.id}`
                                );
                              if (action === "Delete")
                                alert(`Delete category ${category.id}`);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="content_footer">
              <Dropdown
                className="top show_rows sm"
                placeholder="Rows per page"
                selectedValue={selectedValue}
                onClick={(option) => setSelectedValue(option.label)}
                options={[
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                ]}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageCategories;
