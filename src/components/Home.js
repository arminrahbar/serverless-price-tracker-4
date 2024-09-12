import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useProducts } from '../contexts/ProductsContext';

function Home() {
  const { products, selectedProducts, setProducts } = useProducts();  // Access selected products
  const navigate = useNavigate();
  
  // Initialize showPriceUpdate with localStorage value
  const initialPriceUpdateSeen = localStorage.getItem('priceUpdateSeen') === 'true';
  const [showPriceUpdate, setShowPriceUpdate] = useState(!initialPriceUpdateSeen);  // State to track if the notification should show

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
  }, [products, setProducts]);

  const handleViewDetails = (id) => {
    if (id === products[0].id) {
      setShowPriceUpdate(false);  // Hide the notification once details are viewed
      localStorage.setItem('priceUpdateSeen', 'true');  // Mark the update as seen in localStorage
    }
    navigate(`/product/${id}`);
  };

  const renderTrackedProducts = () => {
    // Always display the first product and any additional selected products
    const trackedProducts = [products[0], ...selectedProducts];

    return trackedProducts.map(product => (
      <div key={product.id} className="product-card">
        <h2>{product.name}</h2>
        {/* Show notification for the first product if showPriceUpdate is true */}
        {product.id === products[0].id && showPriceUpdate && (
          <div className="price-update-notification">1 price update</div>
        )}
        <button
          className="details-link"
          onClick={() => handleViewDetails(product.id)}
        >
          View Details
        </button>
      </div>
    ));
  };

  return (
    <div className="home-container">
      <h1>Tracked Products</h1>
      {products.length > 0 ? (
        renderTrackedProducts()
      ) : <p>Loading or no products available.</p>}
      <button className="add-product-btn" onClick={() => navigate('/select-products')}>Add New Product</button>
    </div>
  );
}

export default Home;
