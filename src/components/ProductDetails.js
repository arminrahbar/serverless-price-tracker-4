import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.css';  // Make sure this is the correct path to your Home.css
import { useProducts } from '../contexts/ProductsContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts } = useProducts();
  const [product, setProduct] = useState(null);
  const [isRemovalMode, setIsRemovalMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState(new Set());

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      if (!foundProduct.selectedSites) {
        foundProduct.selectedSites = [foundProduct.sites[0]];
        setProducts(products.map(p => p.id === foundProduct.id ? foundProduct : p));
      }
      setProduct(foundProduct);
    }
  }, [products, id, setProducts]);

  const toggleRemovalMode = () => {
    setIsRemovalMode(prev => !prev);
    setSelectedForRemoval(new Set()); // Reset selection when toggling the mode
  };

  const toggleSiteSelection = (site) => {
    setSelectedForRemoval(prev => {
      const newSet = new Set(prev);
      if (newSet.has(site)) {
        newSet.delete(site);
      } else {
        newSet.add(site);
      }
      return newSet;
    });
  };

  const finalizeRemoval = () => {
    const remainingSites = product.selectedSites.filter(site => !selectedForRemoval.has(site));
    setProduct({ ...product, selectedSites: remainingSites });
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, selectedSites: remainingSites } : p));
    toggleRemovalMode(); // Exit removal mode
  };

  return (
    <div className="container">
      
      {!product ? (
        <p>Loading or Product not found...</p>
      ) : (
        <>
          <h2>{product.name}</h2>
          {product.selectedSites.map((site, index) => (
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
                <label>{site.site}: ${site.price}</label>
              )}
            </div>
          ))}
        </>
      )}
      <div >
        {isRemovalMode ? (
          <button className="btn" onClick={finalizeRemoval}>Done</button>
        ) : (
          <>
            <button className="btn" onClick={() => navigate(`/select-sites/${id}`)}>Add Website</button>
            <button className="btn" onClick={toggleRemovalMode}>Remove Website</button>
            <button className="btn" onClick={() => navigate('/')}>Back to Home</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
