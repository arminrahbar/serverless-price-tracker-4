import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SelectProducts from './components/SelectProducts';
import ProductDetails from './components/ProductDetails'; // Import the ProductDetails component
import SelectSites from './components/SelectSites'; // Import the SelectSites component
import LearnMore from './components/LearnMore'; // Import the LearnMore component
import ContactUs from './components/ContactUs'; // Import the new ContactUs component
import { ProductsProvider } from './contexts/ProductsContext';

function App() {
    return (
        <Router>
            <ProductsProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/select-products" element={<SelectProducts />} />
                    <Route path="/product/:id" element={<ProductDetails />} /> {/* Route for product details */}
                    <Route path="/select-sites/:id" element={<SelectSites />} /> {/* Route for selecting sites */}
                    <Route path="/learn-more" element={<LearnMore />} /> {/* Route for LearnMore component */}
                    <Route path="/contact-us" element={<ContactUs />} /> {/* New route for ContactUs component */}
                </Routes>
            </ProductsProvider>
        </Router>
    );
}

export default App;
