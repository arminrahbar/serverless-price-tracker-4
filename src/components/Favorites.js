import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductsContext";
import Layout from "./Layout";
import "./Home.css";

const Favorites = () => {
  const { collections, setCollections } = useProducts();
  const navigate = useNavigate();
  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const allItemsCollection =
    collections.find((c) => c.name === "All Items")?.items || [];
  const filteredItems = allItemsCollection.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCollection = () => {
    if (newCollectionName.trim() !== "") {
      const newCollection = { name: newCollectionName, items: [] };
      setCollections([...collections, newCollection]);
      setNewCollectionName("");
      setShowCreateCollectionModal(false);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim() !== "");
  };

  const handleExitSearch = () => {
    setSearchQuery(""); // Clear the search query state
    setShowSearchResults(false); // Hide the search results
  };

  return (
    <Layout
      showSearch={true}
      searchPlaceholder="Search your favorites..."
      searchValue={searchQuery} // Pass searchQuery to control the input value
      onSearchChange={handleSearchChange}
    >
      <div className="container">
        {/* Page Title with Exit Search Button */}
        <div className="home-page-second-header">
          <h2>Favorites</h2>
          {showSearchResults && (
            <button
              onClick={handleExitSearch}
              className="exit-search-button"
              aria-label="Exit search results"
            >
              Exit Search Results
            </button>
          )}
        </div>

        {/* Search Results or Collections */}
        {showSearchResults ? (
          <div className="search-results-container">
            <div className="products-grid">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <h2>{item.name}</h2>
                  <div className="image-container">
                    <img
                      src={process.env.PUBLIC_URL + item.image}
                      alt={item.name}
                      className="product-image"
                    />
                  </div>
                  <p>{item.description || "No description available"}</p>
                  <p className="price">
                    ${item.sites && item.sites.length > 0 ? item.sites[0].price : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="collections-container">
            <div
              className="collection-card"
              onClick={() => navigate("/collections/All Items")}
            >
              <h3>All Items</h3>
              <p>{allItemsCollection.length} items</p>
            </div>

            <div
              className="collection-card"
              onClick={() => setShowCreateCollectionModal(true)}
              style={{ cursor: "pointer" }}
            >
              <h3>Create Collection</h3>
            </div>

            {collections
              .filter((collection) => collection.name !== "All Items")
              .map((collection, index) => (
                <div
                  key={index}
                  className="collection-card"
                  onClick={() => navigate(`/collections/${collection.name}`)}
                >
                  <h3>{collection.name}</h3>
                  <p>{collection.items.length} items</p>
                </div>
              ))}
          </div>
        )}

        {/* Create Collection Modal */}
        {showCreateCollectionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Enter Collection Name</h4>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection Name"
              />
              <button onClick={handleCreateCollection}>Create</button>
              <button onClick={() => setShowCreateCollectionModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
