import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductsContext";
import Layout from "./Layout";
import "./Home.css";

const CollectionItem = () => {
  const { collectionName } = useParams();
  const { collections, setCollections, setFavorites, removeFromCollection } = useProducts();
  const navigate = useNavigate();
  const [showUndoButton, setShowUndoButton] = useState(false);
  const [removedProduct, setRemovedProduct] = useState(null);
  const [removedCollectionName, setRemovedCollectionName] = useState(null);

  const sortedCollections = collections.sort((a, b) => {
    if (a.name === "All Items") return -1;
    if (b.name === "All Items") return 1;
    if (a.name === "Create Collection") return -1;
    if (b.name === "Create Collection") return 1;
    return a.name.localeCompare(b.name); // Sort other collections alphabetically
  });

  const collection = sortedCollections.find((c) => c.name === collectionName);

  if (!collection) {
    return <div>Collection not found.</div>; // Gracefully handle non-existing collections
  }

  const handleItemClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to detailed product page
  };

  const handleRemove = (item) => {
    const productId = item.id;
  
    if (collection.name === "All Items") {
      // If the current collection is "All Items," remove the product from all collections
      setCollections((prevCollections) =>
        prevCollections.map((col) => ({
          ...col,
          items: col.items.filter((product) => product.id !== productId),
        }))
      );
  
      // Also remove from favorites since it no longer exists in any collection
      setFavorites((prev) => {
        const updatedFavorites = new Set(prev);
        updatedFavorites.delete(productId);
        sessionStorage.setItem("favorites", JSON.stringify([...updatedFavorites]));
        return updatedFavorites;
      });
    } else {
      // Remove item from the current collection
      removeFromCollection(collection.name, productId);
  
      // Check if the item exists in any other collections
      const existsInOtherCollections = collections
        .filter((col) => col.name !== collection.name)
        .some((col) => col.items.some((product) => product.id === productId));
  
      if (!existsInOtherCollections) {
        // If it doesn't exist in other collections, remove it from All Items
        removeFromCollection("All Items", productId);
  
        // Also remove from favorites since it no longer exists in any collection
        setFavorites((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.delete(productId);
          sessionStorage.setItem(
            "favorites",
            JSON.stringify([...updatedFavorites])
          );
          return updatedFavorites;
        });
      }
    }
  
    // Store removed item and collection for Undo
    setRemovedProduct(item);
    setRemovedCollectionName(collection.name);
    setShowUndoButton(true);
  
    // Hide Undo button after 5 seconds
    setTimeout(() => {
      setShowUndoButton(false);
      setRemovedProduct(null);
      setRemovedCollectionName(null);
    }, 5000);
  };
  
  

  const handleUndo = () => {
    if (removedProduct) {
      // Restore item to the current collection
      setCollections((prevCollections) =>
        prevCollections.map((col) => {
          if (col.name === removedCollectionName) {
            return {
              ...col,
              items: [...col.items, removedProduct],
            };
          }
          if (col.name === "All Items") {
            return {
              ...col,
              items: col.items.some((item) => item.id === removedProduct.id)
                ? col.items
                : [...col.items, removedProduct],
            };
          }
          return col;
        })
      );

      // Restore item to favorites if necessary
      setFavorites((prev) => new Set(prev).add(removedProduct.id));

      // Clear Undo state
      setShowUndoButton(false);
      setRemovedProduct(null);
      setRemovedCollectionName(null);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="second-header">
          <h2>{collection.name} Collection</h2>
          {showUndoButton && (
            <button className="undo-button" onClick={handleUndo}>
              Undo
            </button>
          )}
        </div>
        <div className="products-grid">
          {collection.items.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => handleItemClick(item.id)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <h2>{item.name}</h2>
              <div className="image-container">
                <img
                  src={process.env.PUBLIC_URL + item.image}
                  alt={item.name}
                  className="product-image"
                />
              </div>
              <p>{item.information || "No description available"}</p>
              <p className="price">
                $
                {item.sites && item.sites.length > 0
                  ? item.sites[0].price
                  : "N/A"}
              </p>
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item);
                }}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#FF6347",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#FF4500")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#FF6347")
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CollectionItem;
