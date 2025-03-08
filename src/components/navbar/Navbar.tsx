import React, { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.scss";

interface User {
  email: ReactNode;
  name: ReactNode;
  id: string;
  username: string;
  role: "Seller" | "Buyer" | "Farmer";
  img?: string;
}

const Navbar: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Function to check if the Navbar should be active
  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  // Retrieve the current user from localStorage
  const currentUser: User | null = JSON.parse(localStorage.getItem("currentUser") || "null");

  // Logout function
  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.post("http://localhost:8080/user/logout");

      // Clear the user session from localStorage
      localStorage.removeItem("currentUser");

      // Redirect the user to the login page
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">auction</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="User Avatar" />
              <span>
                {currentUser?.name} ({currentUser?.email})
              </span>
              {open && (
                <div className="options">
                  <p className="user-id">
                    <strong>Your Role:</strong> {currentUser.role}
                  </p>
                  {currentUser.role === "Seller" && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  {currentUser.role === "Farmer" ? (
                    <Link className="link" to="/orders">
                      Orders
                    </Link>
                  ) : currentUser.role === "Buyer" ? (
                    <Link className="link" to="/gigs">
                      Gigs
                    </Link>
                  ) : null}
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/">
              Home
            </Link>
            <Link className="link menuLink" to="/add">
              List Your Product
            </Link>
            <Link className="link menuLink" to="/myGigs">
              See Bids
            </Link>
            <Link className="link menuLink" to="/message">
              Message
            </Link>
            <Link className="link menuLink" to="/gigs">
              Buy Product
            </Link>
            {currentUser?.role === "Seller" && (
              <Link className="link menuLink" to="/mygigs">
                Manage Gigs
              </Link>
            )}
          </div>
          <hr />
        </>
      )}
    </div>
  );
};

export default Navbar;





