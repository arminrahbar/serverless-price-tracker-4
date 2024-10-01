import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.css'; // Make sure this is the correct path to your Home.css
import { useProducts } from '../contexts/ProductsContext';
import Layout from './Layout'; // Import Layout component

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts } = useProducts();
  const [product, setProduct] = useState(null);
  const [isRemovalMode, setIsRemovalMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState(new Set());
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false); // No products selected pop-up
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Confirmation pop-up
  const [isFirstVisit, setIsFirstVisit] = useState(false); // Track if this is the first visit

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      if (foundProduct.id === products[0]?.id) {
        const visitFlag = localStorage.getItem('firstProductVisited');
        const visibleFlag = localStorage.getItem('firstProductVisible');

        if (!visitFlag) {
          setIsFirstVisit(true);
          localStorage.setItem('firstProductVisited', 'true');
          localStorage.setItem('firstProductVisible', 'true');
        } else {
          setIsFirstVisit(visibleFlag === 'true'); // Restore visibility state based on `firstProductVisible`
        }
      }

      if (!foundProduct.selectedSites) {
        foundProduct.selectedSites = [foundProduct.sites[0]];
        setProducts(products.map((p) => (p.id === foundProduct.id ? foundProduct : p)));
      }
      setProduct(foundProduct);
    }
  }, [products, id, setProducts]);

  const toggleRemovalMode = () => {
    setIsRemovalMode((prev) => !prev);
    setSelectedForRemoval(new Set()); // Reset selection when toggling the mode
  };

  const toggleSiteSelection = (site) => {
    setSelectedForRemoval((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(site)) {
        newSet.delete(site);
      } else {
        newSet.add(site);
      }
      return newSet;
    });
  };

  const handleRemoveClick = () => {
    if (selectedForRemoval.size === 0) {
      setShowNoSelectionModal(true); // Show the modal if no sites are selected
    } else {
      setShowConfirmationModal(true); // Show confirmation modal
    }
  };

  const finalizeRemoval = () => {
    const remainingSites = product.selectedSites.filter((site) => !selectedForRemoval.has(site));
    setProduct({ ...product, selectedSites: remainingSites });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, selectedSites: remainingSites } : p)));
    setShowConfirmationModal(false); // Close the confirmation modal
    toggleRemovalMode(); // Exit removal mode
  };

  const handleBackToHome = () => {
    localStorage.setItem('firstProductVisible', 'false'); // Set visibility to false when going back to home
    navigate('/'); // Navigate back to the home page
  };

  return (
    <Layout>
      <div className="container">
        {/* Overlay and modal for no products selected */}
        {showNoSelectionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>No vendor selected for removal.</h4>
              <button className="btn" onClick={() => setShowNoSelectionModal(false)}>Okay</button>
            </div>
          </div>
        )}

        {/* Overlay and modal for confirmation */}
        {showConfirmationModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Are you sure you want to remove the selected vendors?</h4>
              <button className="btn" onClick={finalizeRemoval}>Yes</button>
              <button className="btn" onClick={() => setShowConfirmationModal(false)}>No</button>
            </div>
          </div>
        )}

        {!product ? (
          <p>Loading or Product not found...</p>
        ) : (
          <>
            {/* Conditional rendering of the header based on the mode */}
            <h2>{isRemovalMode ? "Select vendors to remove from tracking" : product.name}</h2>

            {/* Display product image below the product name */}
            <div className="image-container">
              <img
                src={process.env.PUBLIC_URL + product.image}
                alt={product.name}
                className="product-image"
              />
            </div>

            {/* Display product information under the product image */}
            <p>{product.information}</p>

            {/* Display a message when no vendors are currently tracked */}
            {product.selectedSites && product.selectedSites.length === 0 && (
              <p>No vendors currently tracked for this product.</p>
            )}

            {/* Render the sites for the current product */}
            {product.selectedSites && product.selectedSites.length > 0 && product.selectedSites.map((site, index) => (
              <div className="item" key={index}>
                {isRemovalMode ? (
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedForRemoval.has(site)}
                      onChange={() => toggleSiteSelection(site)}
                    />
                    {site.site}: ${site.price}
                  </label>
                ) : (
                  <>
                    {isFirstVisit && index === 0 && product.id === products[0]?.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'red', textDecoration: 'line-through' }}>
                          Amazon: $3550
                        </span>
                        <div style={{ color: 'green' }}>{`${site.site}: $${site.price}`}</div>
                      </div>
                    ) : (
                      <label>{`${site.site}: $${site.price}`}</label>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {/* Render buttons based on the mode */}
        <div>
          {isRemovalMode ? (
            <>
              <button className="btn" onClick={handleRemoveClick}>Remove</button>
              <button className="btn" onClick={toggleRemovalMode}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => navigate(`/select-sites/${id}`)}>Add Vendor</button>
              {product && product.selectedSites.length > 0 && (
                <button className="btn" onClick={toggleRemovalMode}>Remove Vendor</button>
              )}
              <button className="btn" onClick={handleBackToHome}>Back to Home</button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetails;
