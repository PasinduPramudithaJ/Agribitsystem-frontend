import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import Featured from "../../components/featured/Featured";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import { cards, projects } from "../../data";

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/gigs");
  };
  const ButtonClick = () => {
    navigate("/add");
  };
  const ButtonClick1 = () => {
    navigate("/order");
  };

  return (
    <div className="home">
      <Featured />
      <TrustedBy />
      <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} card={card} />
        ))}
      </Slide>

      {/* Features Section */}
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A World of Agricultural Opportunities at Your Fingertips</h1>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              The Best for Every Budget
            </div>
            <p>
              Provide flexible pricing options for bids and services to accommodate small-scale and large-scale agricultural stakeholders.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Quality Transactions Done Quickly
            </div>
            <p>
              Enable users to find verified buyers and sellers in minutes with an easy-to-use interface.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Protected Payments, Every Time
            </div>
            <p>
              Implement escrow payment systems where funds are only released once both parties are satisfied with the transaction.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              24/7 support
            </div>
            <p>
              Ensure farmers, sellers, and buyers can access help through live chat, email, or phone support at any time.
            </p>
          </div>
          <div className="item">
            <video src="./img/ve.mp4" controls />
          </div>
        </div>
      </div>

      {/* Key Features for Farmers */}
      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              Key<i> Features</i> For<i> Farmers </i>
            </h1>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Easy product listing (e.g., vegetables, fruits, coconuts).
            </div>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Real-time bidding updates on their dashboard.
            </div>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Secure payments and trusted buyers.
            </div>
            <div className="d-flex justify-content-between">
            <button onClick={ButtonClick}>List Your Product</button>
            <button onClick={ButtonClick1}>See Product Bids</button>
    </div>
             
            
          </div>
          <div className="item">
            <img src="./img/veg3.jpg" alt="Vegetables" />
          </div>
        </div>
      </div>

      {/* Key Features for Buyers */}
      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              Key<i> Features</i> For<i> Buyers </i>
            </h1>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Access to fresh produce and high-quality items directly from farmers.
            </div>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Transparent bidding process, ensuring fair prices.
            </div>
            <div className="title">
              <img src="./img/check.png" alt="Checkmark" />
              Flexible delivery or pickup options tailored to your convenience.
            </div>
            <button onClick={handleButtonClick}>Buy Your Product</button>

            

          </div>
          <div className="item">
            <img src="./img/buy1.png" alt="Buy Products" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

