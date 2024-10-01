import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout'; // Import the Layout component
import './Home.css';
import { useProducts } from '../contexts/ProductsContext';

function SelectProducts() {
  const { products, selectedProducts, setSelectedProducts } = useProducts();
  const [newlySelected, setNewlySelected] = useState(new Set());
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false); // State to show modal for no products selected
  const navigate = useNavigate();

  // Handle checkbox selection
  const handleCheckboxChange = (productId) => {
    setNewlySelected((prev) => {
      const updated = new Set(prev);
      if (updated.has(productId)) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }
      return updated;
    });
  };

  // Handle the Add button click
  const handleAdd = () => {
    if (newlySelected.size === 0) {
      setShowNoSelectionModal(true); // Show the modal if no products are selected
      return;
    }

    // Add newly selected products to the selectedProducts array
    const newSelections = products.filter((p) => newlySelected.has(p.id));
    setSelectedProducts([...selectedProducts, ...newSelections]);
    navigate('/');
  };

  // Handle the Back to Home or Cancel button click
  const handleBackToHome = () => {
    navigate('/');
  };

  // Get untracked products
  const unselectedProducts = products.filter(
    (product) => !selectedProducts.some((p) => p.id === product.id)
  );

  const renderProducts = () => {
    return unselectedProducts.map((product) => (
      <div key={product.id} className="item">
        <input
          type="checkbox"
          id={`product-${product.id}`}
          checked={newlySelected.has(product.id)}
          onChange={() => handleCheckboxChange(product.id)}
        />
        <label htmlFor={`product-${product.id}`}>{product.name}</label>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="container">
        {/* Modal for No Product Selected */}
        {showNoSelectionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>No products selected to be tracked.</h4>
              <button className="btn" onClick={() => setShowNoSelectionModal(false)}>Okay</button>
            </div>
          </div>
        )}

        {/* Change the header text based on the availability of new products */}
        <h2>{unselectedProducts.length > 0 ? 'New Products to Track' : 'No new products available'}</h2>

        {/* Render the products or a message when no new products are available */}
        {unselectedProducts.length > 0 ? renderProducts() : <p></p>}

        {/* Conditionally render buttons based on the product availability */}
        {unselectedProducts.length > 0 ? (
          <>
            <button className="btn" onClick={handleAdd}>Track</button>
            <button className="btn" onClick={handleBackToHome}>Cancel</button>
          </>
        ) : (
          <button className="btn" onClick={handleBackToHome}>Back to Home</button>
        )}
      </div>
    </Layout>
  );
}

export default SelectProducts;
