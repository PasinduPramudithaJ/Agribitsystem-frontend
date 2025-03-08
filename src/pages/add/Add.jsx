import React, { useState, useEffect } from "react";
import "./Add.scss";
import { useNavigate } from "react-router-dom";

const PRIMARY_API = "http://localhost:8080/api/products";
const SECONDARY_API = "https://agribitsystembackend-production.up.railway.app";

const Add = () => {
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    category: "",
    description: "",
    quantity: 0,
    quality: "",
    location: "",
    startBidPrice: 0.0,
    buyNowPrice: 0.0,
    size: "",
    status: "",
    productQuantity: 0,
    userId: "", 
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const { userId } = JSON.parse(currentUser);
      setProduct((prevProduct) => ({ ...prevProduct, userId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!product.productId.trim()) newErrors.productId = "Product ID is required.";
    if (!product.name.trim()) newErrors.name = "Product Name is required.";
    if (!product.category) newErrors.category = "Category is required.";
    if (!product.startBidPrice || product.startBidPrice <= 0)
      newErrors.startBidPrice = "Start Bid Price must be greater than 0.";
    if (!product.buyNowPrice || product.buyNowPrice <= 0)
      newErrors.buyNowPrice = "Buy Now Price must be greater than 0.";
    return newErrors;
  };

  const submitToAPI = async (apiUrl) => {
    const formData = new FormData();
    formData.append("product", JSON.stringify(product));
    if (image) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser")).token
      : null;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return response;
    } catch (error) {
      console.error(`Error sending request to ${apiUrl}:`, error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let response = await submitToAPI(PRIMARY_API);
    if (!response || !response.ok) {
      console.warn("Primary API failed, trying secondary API...");
      response = await submitToAPI(SECONDARY_API);
    }

    if (response && response.ok) {
      alert("Product created successfully!");
      navigate("/gigs");
    } else {
      alert("Failed to create product. Please try again later.");
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Product</h1>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Product ID", name: "productId", type: "text", placeholder: "Unique Product ID" },
            { label: "Name", name: "name", type: "text", placeholder: "Product Name" },
            { label: "Description", name: "description", type: "textarea", placeholder: "Product Description" },
            { label: "Quantity", name: "quantity", type: "number", placeholder: "Available Quantity" },
            { label: "Quality", name: "quality", type: "text", placeholder: "Product Quality" },
            { label: "Location", name: "location", type: "text", placeholder: "Product Location" },
            { label: "Start Bid Price", name: "startBidPrice", type: "number", placeholder: "Start Bid Price" },
            { label: "Buy Now Price", name: "buyNowPrice", type: "number", placeholder: "Buy Now Price" },
            { label: "Size", name: "size", type: "text", placeholder: "Product Size or Dimensions" },
            { label: "Status", name: "status", type: "text", placeholder: "Status (e.g., Available, Sold)" },
            { label: "Stock Quantity", name: "productQuantity", type: "number", placeholder: "Stock Quantity" },
          ].map((field) => (
            <div className="form-group" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  value={product[field.name]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  value={product[field.name]}
                  onChange={handleChange}
                  required
                />
              )}
              {errors[field.name] && <span className="error">{errors[field.name]}</span>}
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input type="file" name="image" id="image" accept="image/*" onChange={handleImageChange} />
          </div>
          <button type="submit">Create Product</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
