import React, { useState } from 'react';
import './Home.css'; // Import your main CSS file for styling
import { useNavigate } from 'react-router-dom';

// Define a Layout component
const Layout = ({ children }) => {
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      {/* Common Header */}
      <header className="app-header">
        <h1 className="header-text">Savr</h1>

        {/* Help Button with Hoverable Dropdown */}
        <div
          className="help-button-container"
          onMouseEnter={() => setShowHelpDropdown(true)}
          onMouseLeave={() => setShowHelpDropdown(false)}
        >
          <button className="help-button">Help</button>

          {/* Dropdown Menu */}
          {showHelpDropdown && (
            <div className="help-dropdown">
              <span
                className="dropdown-item"
                onClick={() => {
                  setShowHelpDropdown(false);
                  navigate('/contact-us');
                }}
              >
                Contact Support
              </span>
              <span
                className="dropdown-item"
                onClick={() => {
                  setShowHelpDropdown(false);
                  navigate('/learn-more');
                }}
              >
                How Savr Works
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Render page-specific content below the header */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
