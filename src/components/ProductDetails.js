import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Home.css'; // Make sure this is the correct path to your Home.css
import { useProducts } from '../contexts/ProductsContext';
import Layout from './Layout'; // Import Layout component

function ProductDetails() {
  const { id } = useParams();
  const { products, setProducts } = useProducts();
  const [product, setProduct] = useState(null);
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

  return (
    <Layout>
      <div className="container">
        {!product ? (
          <p>Loading or Product not found...</p>
        ) : (
          <>
            <h2>{product.name}</h2>

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
            {product.sites && product.sites.length === 0 && (
              <p>No vendors currently tracked for this product.</p>
            )}

            {/* Render the sites for the current product */}
            {product.sites && product.sites.length > 0 && product.sites.map((site, index) => (
              <div className="item" key={index}>
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
              </div>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
}

export default ProductDetails;
