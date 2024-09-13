import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useProducts } from '../contexts/ProductsContext';

function Home() {
  const { products, setProducts, selectedProducts, setSelectedProducts } = useProducts();
  const navigate = useNavigate();

  // Initialize showPriceUpdate based on the current localStorage setting
  const [showPriceUpdate, setShowPriceUpdate] = useState(() => {
    const seen = localStorage.getItem('priceUpdateSeen');
    if (seen === null) {  // If no entry in localStorage, show the notification
      localStorage.setItem('priceUpdateSeen', 'false');
      return true;
    }
    return seen !== 'true';  // Show notification if not marked true
  });

  const [isRemovalMode, setIsRemovalMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState(new Set());

  useEffect(() => {
    // Perform data fetching only if products are not already loaded
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
    // Add event listener to clear localStorage when the page is being unloaded
    const handleUnload = () => {
      localStorage.removeItem('priceUpdateSeen');
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const handleViewDetails = (id) => {
    if (id === products[0].id) {
      setShowPriceUpdate(false);
      localStorage.setItem('priceUpdateSeen', 'true');  // Mark the update as seen when the first product's details are viewed
    }
    navigate(`/product/${id}`);
  }; // Include products.length here


  const toggleSelection = (id) => {
    setSelectedForRemoval(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const removeProducts = () => {
    const newSelectedProducts = selectedProducts.filter(p => !selectedForRemoval.has(p.id));
    setSelectedProducts(newSelectedProducts);
    setSelectedForRemoval(new Set());  // Clear the selection
    setIsRemovalMode(false);  // Exit removal mode
};


  const renderTrackedProducts = () => {
    return selectedProducts.map(product => (
      <div key={product.id} className="product-card">
        <h2>{product.name}</h2>
        {isRemovalMode && (
          <input
            type="checkbox"
            checked={selectedForRemoval.has(product.id)}
            onChange={() => toggleSelection(product.id)}
          />
        )}
        {!isRemovalMode && (
          <button className="details-link" onClick={() => handleViewDetails(product.id)}>
            View Details
          </button>
        )}
        {product.id === products[0].id && showPriceUpdate && (
          <div className="price-update-notification">1 price update</div>
        )}
      </div>
    ));
  };

  return (
    <div className="container">
      <h2>Tracked Products</h2>
      {products.length > 0 ? renderTrackedProducts() : <p>Loading or no products available.</p>}
      {isRemovalMode ? (
        <>
          <button className="btn" onClick={removeProducts}>Done</button>
          <button className="btn" onClick={() => setIsRemovalMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <button className="btn" onClick={() => navigate('/select-products')}>Add Product</button>
          <button className="btn" onClick={() => setIsRemovalMode(true)}>Remove Product</button>
        </>
      )}
    </div>
  );
}

export default Home;
