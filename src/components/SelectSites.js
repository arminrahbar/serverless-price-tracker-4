import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Home.css';
import { useProducts } from '../contexts/ProductsContext';
import Layout from './Layout'; // Import Layout component

function SelectSites() {
  const { products, setProducts } = useProducts(); // Access products and update function from context
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [newlySelected, setNewlySelected] = useState(new Set()); // Track newly selected sites
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false); // Track if no sites are selected

  // Find the product by ID
  const product = products.find((p) => p.id === parseInt(id));

  // Filter out the first site and any sites already selected in ProductDetails
  const unselectedSites = product.sites.filter(
    (site) => !product.selectedSites?.some((s) => s.site === site.site) // Remove sites that are already selected
  );

  const handleCheckboxChange = (siteName) => {
    setNewlySelected((prev) => {
      const updated = new Set(prev);
      if (updated.has(siteName)) {
        updated.delete(siteName); // Remove if already selected
      } else {
        updated.add(siteName); // Add if not selected
      }
      return updated;
    });
  };

  // Render available (unselected) sites for selection
  const renderSites = () => {
    return unselectedSites.map((site, index) => (
      <div key={index} className="item">
        <input
          type="checkbox"
          id={`site-${site.site}`} // Use site name as ID
          checked={newlySelected.has(site.site)} // Check if site is newly selected
          onChange={() => handleCheckboxChange(site.site)} // Handle checkbox toggle
        />
        <label htmlFor={`site-${site.site}`}>{site.site}: ${site.price}</label>
      </div>
    ));
  };

  // Handle "Track" button click
  const handleAdd = () => {
    if (newlySelected.size === 0) {
      // If no sites are selected, show the warning modal
      setShowNoSelectionModal(true);
      return;
    }

    // Find the newly selected sites
    const newSelections = product.sites.filter((site) => newlySelected.has(site.site));

    // Update the product's selected sites to include newly selected ones
    const updatedProduct = {
      ...product,
      selectedSites: product.selectedSites
        ? [...product.selectedSites, ...newSelections]
        : [...newSelections],
    };

    // Update the context with the modified product
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === product.id ? updatedProduct : p)));

    // Navigate back to the product detail page
    navigate(`/product/${id}`);
  };

  // Handle "Cancel" or "Back to Product Details" button click
  const handleBackToProduct = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Layout>
      <div className="container">
        {/* Modal for No Site Selected */}
        {showNoSelectionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>No vendors selected to be tracked.</h4>
              <button className="btn" onClick={() => setShowNoSelectionModal(false)}>Okay</button>
            </div>
          </div>
        )}

        {/* Change the header text based on the availability of new sites */}
        <h2>{unselectedSites.length > 0 ? 'New Vendors to Track' : 'No new vendors available'}</h2>

        {/* Render the sites or a message when no new vendors are available */}
        {unselectedSites.length > 0 ? renderSites() : <p></p>}

        {/* Conditionally render buttons based on the availability of new vendors */}
        {unselectedSites.length > 0 ? (
          <>
            <button className="btn" onClick={handleAdd}>Track</button>
            <button className="btn" onClick={handleBackToProduct}>Cancel</button>
          </>
        ) : (
          <button className="btn" onClick={handleBackToProduct}>Back to Product Details</button>
        )}
      </div>
    </Layout>
  );
}

export default SelectSites;
