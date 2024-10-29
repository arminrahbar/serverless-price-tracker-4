import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout"; // Import the Layout component
import "./Home.css"; // Ensure consistent styling with Home component
import { useProducts } from "../contexts/ProductsContext";
import CollectionModal from "./CollectionModal"; // Assuming you have created this component for modal handling

function Home() {
  const {
    products,
    setProducts,
    favorites,
    setFavorites,
    addToCollection,
    setCollections,
    selectedCollections,
    collections,
    createCollection, 
  } = useProducts();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip state for visibility
  const [showCollectionModal, setShowCollectionModal] = useState(false); // State for modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State to keep track of the selected product

  useEffect(() => {
    if (products.length === 0) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/store.json`);
          const productsData = await response.json();
          setProducts(productsData);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };
      fetchProducts();
    }
  }, [products.length, setProducts]);

  const handleCreateCollection = (newCollectionName) => {
    createCollection(newCollectionName); // Create an empty collection
};

  const handleFavoriteToggle = (product) => {
    if (favorites.has(product.id)) {
      // Unfavorite: Remove from favorites and all collections
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        newFavorites.delete(product.id);
        sessionStorage.setItem("favorites", JSON.stringify([...newFavorites]));
        return newFavorites;
      });
  
      // Remove the product from all collections
      setCollections((prevCollections) =>
        prevCollections.map((collection) => ({
          ...collection,
          items: collection.items.filter((item) => item.id !== product.id),
        }))
      );
    } else {
      // Favorite: Show modal to add to collections
      setSelectedProduct(product);
      setShowCollectionModal(true);
    }
  };

  const handleAddToCollection = (selectedCollections) => {
    selectedCollections.forEach((collectionName) => {
      addToCollection(collectionName, selectedProduct);
    });
  
    // Update favorites after confirming addition
    setFavorites((prev) => new Set(prev.add(selectedProduct.id)));
    sessionStorage.setItem(
      "favorites",
      JSON.stringify([...favorites, selectedProduct.id])
    );
    setShowCollectionModal(false);
  };
  

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`); // Navigate to the product details page
  };

  const renderProducts = () => {
    return (
      <div className="products-grid">
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleViewDetails(product.id)} // Make the card clickable
              style={{ cursor: "pointer" }} // Change cursor to indicate clickable
            >
              <h2>{product.name}</h2>
              <div className="image-container">
                <img
                  src={process.env.PUBLIC_URL + product.image}
                  alt={product.name}
                  className="product-image"
                />
                <button
                  className="favorite-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click event from bubbling to the card
                    handleFavoriteToggle(product);
                  }}
                  aria-label="Toggle favorite"
                  style={{
                    position: "absolute", // Position the button absolutely
                    top: "10px", // Distance from the top of the card
                    right: "10px", // Distance from the right of the card
                    background: "none", // Remove background
                    border: "none", // Remove border
                    fontSize: "32px", // Adjust size to make it bigger
                    cursor: "pointer", // Change cursor on hover
                    color: favorites.has(product.id) ? "red" : "gray", // Change color based on favorite status
                    lineHeight: "1.1", // Align icons vertically
                    transition: "color 0.3s", // Smooth transition for color change
                  }}
                >
                  {favorites.has(product.id) ? "♥" : "♡"}{" "}
                  {/* Heart symbols for favorite */}
                </button>
              </div>
              <p>{product.information}</p>
              {/* Display Amazon's price */}
              {product.sites && product.sites.length > 0 && (
                <p style={{ fontWeight: "bold" }}>${product.sites[0].price}</p>
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <Layout
      showSearch={true}
      searchPlaceholder="Search for products..."
      onSearchChange={setSearchQuery}
    >
      <div className="container">
        <div className="home-page-second-header">
          <h2>
            Available Products
            <span className="tooltip-container">
              <span
                className="info-icon"
                onClick={() => setShowTooltip((prev) => !prev)}
              >
                i
              </span>
              {showTooltip && (
                <div className="tooltip-box">
                  <span className="tooltip-content">
                    Explore how Savr works:
                    <span
                      className="read-more-link"
                      onClick={() => {
                        setShowTooltip(false);
                        navigate("/learn-more");
                      }}
                    >
                      {"  "}Read more
                    </span>
                  </span>
                  <span
                    className="tooltip-close"
                    onClick={() => setShowTooltip(false)}
                  >
                    ✖
                  </span>
                </div>
              )}
            </span>
          </h2>
        </div>
        <div className="products-list">
          {renderProducts()}
        </div>
        {showCollectionModal && (
  <CollectionModal
    show={showCollectionModal}
    collections={collections}
    onSelect={handleAddToCollection}
    onClose={() => setShowCollectionModal(false)}
    onCreateCollection={handleCreateCollection}
    selectedCollections={selectedCollections} // Pass selected collections
  />
)}
      </div>
    </Layout>
  );
}

export default Home;