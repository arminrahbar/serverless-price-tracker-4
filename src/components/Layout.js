import React, { useState } from "react";
import "./Home.css"; // Import your main CSS file for styling
import { useNavigate } from "react-router-dom";

// Define a Layout component
const Layout = ({ children, showSearch, searchPlaceholder, onSearchChange, searchValue }) => {
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); // Assuming '/' is your home route
  };

  return (
    <div>
      {/* Common Header */}
      <header className="app-header">
        {/* Left Section: Logo */}
        <div className="header-logo">
          <h1
            className="logo-text"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
            Savr
          </h1>
        </div>

        {/* Center Section: Search bar */}
        {showSearch && (
  <div className="search-container">
    <input
      type="text"
      placeholder={searchPlaceholder}
      className="search-bar"
      value={searchValue} // Bind input value to searchValue prop
      onChange={(e) => onSearchChange(e.target.value)}  // Use the callback here
    />
  </div>
)}

        {/* Right Section: Favorites & Help buttons */}
        <div className="header-right-buttons">
          <button
            className="help-button"
            onClick={() => navigate("/favorites")}
          >
            Favorites
          </button>

          <div
            className="help-button-container"
            onMouseEnter={() => setShowHelpDropdown(true)}
            onMouseLeave={() => setShowHelpDropdown(false)}
          >
            <button className="help-button">Help</button>
            {showHelpDropdown && (
              <div className="help-dropdown">
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setShowHelpDropdown(false);
                    navigate("/contact-us");
                  }}
                >
                  Contact Support
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setShowHelpDropdown(false);
                    navigate("/learn-more");
                  }}
                >
                  How Savr Works
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Render page-specific content below the header */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
