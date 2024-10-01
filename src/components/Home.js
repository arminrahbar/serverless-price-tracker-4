import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout"; // Import the Layout component
import "./Home.css";
import { useProducts } from "../contexts/ProductsContext";

function Home() {
  const { products, setProducts, selectedProducts, setSelectedProducts } =
    useProducts();
  const navigate = useNavigate();
  const [showPriceUpdate, setShowPriceUpdate] = useState(() => {
    const seen = localStorage.getItem("priceUpdateSeen");
    if (seen === null) {
      localStorage.setItem("priceUpdateSeen", "false");
      return true;
    }
    return seen !== "true";
  });

  const [isRemovalMode, setIsRemovalMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState(new Set());
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip state for visibility

  useEffect(() => {
    if (products.length === 0) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/store.json`);
          const productsData = await response.json();
          setProducts(productsData);
          setSelectedProducts(productsData.slice(0, 1)); // Initially select the first product
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };
      fetchProducts();
    }
  }, [products.length, setProducts, setSelectedProducts]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("priceUpdateSeen");
      localStorage.removeItem("firstProductVisited"); // Reset the `firstProductVisited` flag on page unload
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleViewDetails = (id) => {
    if (id === products[0].id) {
      setShowPriceUpdate(false);
      localStorage.setItem("priceUpdateSeen", "true");
    }
    navigate(`/product/${id}`);
  };

  const toggleSelection = (id) => {
    setSelectedForRemoval((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleRemoveClick = () => {
    if (selectedForRemoval.size === 0) {
      setShowNoSelectionModal(true); // Show modal if no products are selected
    } else {
      setShowConfirmationModal(true); // Show confirmation modal
    }
  };

  const confirmRemoveProducts = () => {
    const newSelectedProducts = selectedProducts.filter(
      (p) => !selectedForRemoval.has(p.id)
    );
    setSelectedProducts(newSelectedProducts);
    setSelectedForRemoval(new Set()); // Clear the selection
    setIsRemovalMode(false); // Exit removal mode
    setShowConfirmationModal(false); // Close the confirmation modal
  };

  const handleToggleRemovalMode = () => {
    if (isRemovalMode) {
      // When exiting the removal mode, reset the selected products for removal
      setSelectedForRemoval(new Set());
    }
    setIsRemovalMode((prev) => !prev); // Toggle removal mode
  };

  const renderTrackedProducts = () => {
    return (
      <div className="products-grid">
        {selectedProducts
          .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.name}</h2>
              <div className="image-container">
                <img
                  src={process.env.PUBLIC_URL + product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <p>{product.information}</p>
              {isRemovalMode && (
                <input
                  type="checkbox"
                  checked={selectedForRemoval.has(product.id)}
                  onChange={() => toggleSelection(product.id)}
                />
              )}
              {!isRemovalMode && (
                <button
                  className="details-link"
                  onClick={() => handleViewDetails(product.id)}
                >
                  View Details
                </button>
              )}
              {product.id === products[0].id && showPriceUpdate && (
                <div className="price-update-notification">1 price update</div>
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container">
        {/* Modal for No Product Selected */}
        {showNoSelectionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>No product selected for removal.</h4>
              <button className="btn" onClick={() => setShowNoSelectionModal(false)}>Okay</button>
            </div>
          </div>
        )}

        {/* Modal for Confirmation */}
        {showConfirmationModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Are you sure you want to remove the selected products?</h4>
              <button className="btn" onClick={confirmRemoveProducts}>Yes</button>
              <button className="btn" onClick={() => setShowConfirmationModal(false)}>No</button>
            </div>
          </div>
        )}

<h2>
  {isRemovalMode
    ? "Select products to remove from tracking"
    : selectedProducts.length > 0 ? (
      <>
        Tracked Products
        {/* Tooltip Info Icon */}
        <span className="tooltip-container">
          <span className="info-icon" onClick={() => setShowTooltip((prev) => !prev)}>i</span>
          {showTooltip && (
            <div className="tooltip-box">
              <span className="tooltip-content">
                Explore how Savr works:
                <span
                  className="read-more-link"
                  onClick={() => {
                    setShowTooltip(false); // Hide the tooltip when navigating
                    navigate("/learn-more"); // Navigate to LearnMore component
                  }}
                >
                  {"  "}Read more
                </span>
              </span>
              <span className="tooltip-close" onClick={() => setShowTooltip(false)}>✖</span>
            </div>
          )}
        </span>
      </>
    ) : "No products currently tracked"}
</h2>



        {/* Search bar for filtering products */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tracked products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        {/* Add a flex container for the product cards */}
        <div className="products-grid">
          {products.length > 0 ? (
            renderTrackedProducts()
          ) : (
            <p>Loading or no products available.</p>
          )}
        </div>

        {/* Buttons for Add/Remove Product */}
        {isRemovalMode ? (
          <>
            <button className="btn" onClick={handleRemoveClick}>Remove</button>
            <button className="btn" onClick={handleToggleRemovalMode}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => navigate("/select-products")}>Add Product</button>
            {selectedProducts.length > 0 && (
              <button className="btn" onClick={handleToggleRemovalMode}>Remove Product</button>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Home;
