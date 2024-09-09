import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';
import { useProducts } from '../contexts/ProductsContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [additionalSites, setAdditionalSites] = useState([]);  // Tracks additional sites added by user

  useEffect(() => {
    if (products.length > 0) {
      const selectedProduct = products.find(p => p.id === parseInt(id));
      if (selectedProduct) {
        setProduct(selectedProduct);
        // Initially, no additional sites are added, so only display the first site
        setAdditionalSites([]);  // Reset additional sites when the component loads

        // Mark the price update as "seen" in localStorage when viewing the first product
        if (selectedProduct.id === products[0].id) {
          localStorage.setItem('priceUpdateSeen', 'true');
        }
      } else {
        console.log("Product not found");
      }
    }
  }, [products, id]);

  // Check if there are any new sites to add (i.e., added via SelectSites)
  useEffect(() => {
    if (product && product.additionalSites) {
      setAdditionalSites(product.additionalSites);
    }
  }, [product]);

  return (
    <div className="product-details-container">
      <h1>Product Details</h1>
      {!product ? (
        <p>Loading or Product not found...</p>
      ) : (
        <>
          {/* Display the first tracked site */}
          {product.trackedSites.length > 0 && (
            <>
              <h2>{product.name}</h2>
              <p>{product.trackedSites[0].site}: ${product.trackedSites[0].price}</p>
            </>
          )}

          {/* Display additional sites added by the user */}
          {additionalSites.length > 0 && (
            <div>
              <h3>Additional Tracked Sites:</h3>
              {additionalSites.map((site, index) => (
                <p key={index}>{site.site}: ${site.price}</p>
              ))}
            </div>
          )}
        </>
      )}

      <div className="buttons-container">
        <button className="action-button add-website-button" onClick={() => navigate(`/select-sites/${id}`)}>
          Add a New Website
        </button>
        <button className="action-button view-details-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
