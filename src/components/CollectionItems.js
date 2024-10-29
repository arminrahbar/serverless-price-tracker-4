import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import Layout from "./Layout";
import './Home.css';

const CollectionItem = () => {
  const { collectionName } = useParams();
  const { collections, removeFromCollection } = useProducts();
  const navigate = useNavigate();

  const sortedCollections = collections.sort((a, b) => {
    if (a.name === 'All Items') return -1;
    if (b.name === 'All Items') return 1;
    if (a.name === 'Create Collection') return -1;
    if (b.name === 'Create Collection') return 1;
    return a.name.localeCompare(b.name); // Sort other collections alphabetically
  });

  const collection = sortedCollections.find(c => c.name === collectionName);

  if (!collection) {
    return <div>Collection not found.</div>; // Gracefully handle non-existing collections
  }

  const handleItemClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to detailed product page
  };

  return (
    <Layout>
      <div className="container">
        <h2>{collection.name}</h2>
        <div className="products-grid">
          {collection.items.map((item) => (
            <div 
              key={item.id} 
              className="product-card"
              onClick={() => handleItemClick(item.id)}
              style={{ cursor: 'pointer', position: 'relative' }}
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
              <p className="price">${item.sites && item.sites.length > 0 ? item.sites[0].price : "N/A"}</p>
              <button 
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCollection(collection.name, item.id);
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#FF6347',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#FF4500'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6347'}
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
