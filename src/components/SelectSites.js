import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SelectSites.css';
import { useProducts } from '../contexts/ProductsContext';  // Use context to get products and update

function SelectSites() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedSites, setSelectedSites] = useState(new Set());

  useEffect(() => {
    if (products.length > 0) {
      const selectedProduct = products.find(p => p.id === parseInt(id));
      if (selectedProduct) {
        setProduct(selectedProduct);
      }
    }
  }, [products, id]);

  // Handle checkbox change for selecting sites
  const handleCheckboxChange = (siteName) => {
    setSelectedSites(prev => {
      const updated = new Set(prev);
      if (updated.has(siteName)) {
        updated.delete(siteName);
      } else {
        updated.add(siteName);
      }
      return updated;
    });
  };

  const handleDone = () => {
    if (!product) return;

    // Filter the selected sites from trackedSites, excluding the first site
    const newAdditionalSites = product.trackedSites
      .slice(1)  // Skip the first site
      .filter(site => selectedSites.has(site.site));



    // Update additional sites in context and remove them from trackedSites
    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === product.id) {
        return { 
          ...p, 
          trackedSites: [p.trackedSites[0]],  // Keep the first site
          additionalSites: [...newAdditionalSites, ...(p.additionalSites || [])],  // Add to additional sites
        };
      }
      return p;
    }));

    // Navigate back to the product details page
    navigate(`/product/${id}`);
  };

  return (
    <div className="select-sites-container">
      <h1>Select Additional Sites</h1>
      {!product ? (
        <p>Loading...</p>
      ) : product.trackedSites.length > 1 ? (
        product.trackedSites.slice(1).map((site) => (  // Skip the first site
          <div key={site.site} className="select-site-item">
            <input
              type="checkbox"
              id={`site-${site.site}`}
              checked={selectedSites.has(site.site)}
              onChange={() => handleCheckboxChange(site.site)}
            />
            <label htmlFor={`site-${site.site}`}>{site.site}: ${site.price}</label>
          </div>
        ))
      ) : (
        <p>No additional sites available.</p>
      )}
      <button className="action-button" onClick={handleDone}>Done</button>
    </div>
  );
}

export default SelectSites;
