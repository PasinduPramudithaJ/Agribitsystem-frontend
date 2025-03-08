import React from "react";
import "./TrustedBy.scss";

const TrustedBy = () => {
  return (
    <div className="trustedBy">
      <div className="container">
        <span>Courier by:</span>
        <a href="https://pickme.lk/" target="_blank" rel="noopener noreferrer">
        <img src="./img/PI.png" alt="Product 1" />
      </a>
      <a href="https://www.domex.lk/" target="_blank" rel="noopener noreferrer">
        <img src="./img/PI1.jpg" alt="Product 2" />
      </a>

       
      </div>
    </div>
  );
};

export default TrustedBy;
