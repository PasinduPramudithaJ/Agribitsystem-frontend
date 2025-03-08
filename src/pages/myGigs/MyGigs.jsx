import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import axios from "axios";

const MyGigs = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Retrieve the logged-in user's ID from localStorage
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.userId;

  // Fetch user's projects based on the userId
  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/user/${userId}`);
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        setProjects((prev) => prev.filter((project) => project.productId !== id));
      } catch (err) {
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="my-gigs">
      <div className="container">
        <h1>My Products</h1>
        <button className="add-new" onClick={() => navigate("/add")}>
          Add New Product
        </button>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : projects.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Start Bid Price</th>
                <th>Buy Now Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.productId}>
                  <td>{project.name}</td>
                  <td>{project.category}</td>
                  <td>LKR{project.startBidPrice}</td>
                  <td>LKR{project.buyNowPrice}</td>
                  <td>{project.status}</td>
                  <td>
                    <button onClick={() => navigate(`/orders/${project.productId}`)}>
                      View Bids
                    </button>
                    <button onClick={() => navigate(`/edit/${project.productId}`)}>Edit</button>
                    <button onClick={() => handleDelete(project.productId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found. Click "Add New Product" to create one.</p>
        )}
      </div>
    </div>
  );
};

export default MyGigs;












