import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

const Featured: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>Product</span> Reasonable Price
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="Search" />
              <input
                type="text"
                placeholder='Try "Bid Now"'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button>Coconuts</button>
            <button>Vegetables</button>
            <button>Fruits</button>
            <button>Meat</button>
          </div>
        </div>
        <div className="right">
          <img src="./img/veg.png" alt="Vegetables" />
        </div>
      </div>
    </div>
  );
};

export default Featured;

