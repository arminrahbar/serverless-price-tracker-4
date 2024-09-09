import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SelectProducts from './components/SelectProducts';
import ProductDetails from './components/ProductDetails';  // Import the ProductDetails component
import SelectSites from './components/SelectSites';  // Import the SelectSites component
import { ProductsProvider } from './contexts/ProductsContext';

function App() {
    return (
        <Router>
            <ProductsProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/select-products" element={<SelectProducts />} />
                    <Route path="/product/:id" element={<ProductDetails />} />  {/* Route for product details */}
                    <Route path="/select-sites/:id" element={<SelectSites />} />  {/* Route for selecting sites */}
                </Routes>
            </ProductsProvider>
        </Router>
    );
}

export default App;
