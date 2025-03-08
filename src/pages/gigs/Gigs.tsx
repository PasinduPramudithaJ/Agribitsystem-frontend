import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard, { type GigCardProps } from "../../components/gigCard/GigCard"; // Import GigCardProps as a type
import axios from "axios";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<GigCardProps["item"][]>([]); // Correct type usage
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const min = minRef.current?.value || "0";
      const max = maxRef.current?.value || "10000";

      const response = await axios.get(
        `http://localhost:8080/api/products?min=${min}&max=${max}&sort=${sort}`,
        {
          headers: {
            "Current-User-ID": currentUser.id || "",
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const reSort = (type: string) => {
    setSort(type);
    setOpen(false);
  };

  const applyFilters = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [sort]);

  return (
    <div className="gigs">
      <div className="container">
      
        <h1>Products</h1>
        <p>Explore our collection of products available for you!</p>

        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="Min" />
            <input ref={maxRef} type="number" placeholder="Max" />
            <button onClick={applyFilters}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img
              src="./img/down.png"
              alt="Toggle sort menu"
              onClick={() => setOpen(!open)}
              className="toggleSortMenu"
            />
            {open && (
              <div className="rightMenu">
                {sort !== "createdAt" && (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                )}
                {sort !== "sales" && (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="cards">
          {isLoading && <span>Loading...</span>}
          {error && <span className="error">Error: {error}</span>}
          {!isLoading && !error && data.length > 0 ? (
            data.map((product) => <GigCard key={product.productId} item={product} />)
          ) : (
            !isLoading && !error && <span>No products found.</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gigs;




