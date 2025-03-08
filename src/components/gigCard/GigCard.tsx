import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";

export interface GigCardProps {
  item: {
    productId: string;
    name: string;
    startBidPrice: number;
    category: string;
    status: string;
    quantity: number;
    description: string;
    contentType: string;
    image: string;
  };
}

const GigCard: React.FC<GigCardProps> = ({ item }) => {
  return (
    <Link to={`/description/${item.productId}`} className="gigCard">
      <div className="gigCard">
        <img
          src={`data:${item.contentType};base64,${item.image}`}
          alt={item.name}
          className="img-fluid"
          style={{
            height: "280px",
            width: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <div className="info">
          <h2 className="product-name">Item: {item.name}</h2>
          <h3 className="product-id">Product ID: {item.productId}</h3>
          <h3 className="product-price">Min Bid Price: LKR{item.startBidPrice}</h3>
          <span className="product-category">Category: {item.category}</span>
          <h4
            className={`status ${
              item.status === "Available"
                ? "text-success"
                : item.status === "Sold"
                ? "text-danger"
                : "text-warning"
            }`}
          >
            {item.status}
          </h4>
          <h3 className="product-quantity">Quantity: {item.quantity}</h3>
          <p className="product-description">
            <strong>Description:</strong> {item.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;




