import React, { useState, useEffect } from "react";
import "./Add.scss";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append("product", JSON.stringify(product));
    if (image) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser")).token
      : null;

    const apiUrls = [
      "http://localhost:8080/api/products",
      "https://agribitsystembackend-production.up.railway.app/api/products",
    ];

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          alert("Product created successfully!");
          navigate("/gigs");
          return;
        } else {
          const errorData = await response.json();
          console.warn(`Error from ${url}: ${errorData.message}`);
        }
      } catch (error) {
        console.error(`Request failed for ${url}:`, error);
      }
    }

    alert("Failed to create product on all servers. Please try again later.");
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Product</h1>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <button type="submit">Create Product</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
