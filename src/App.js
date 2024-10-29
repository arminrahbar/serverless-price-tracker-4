import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SelectProducts from './components/SelectProducts';
import ProductDetails from './components/ProductDetails';
import SelectSites from './components/SelectSites';
import LearnMore from './components/LearnMore';
import ContactUs from './components/ContactUs';
import Favorites from './components/Favorites'; 
import CollectionItems from './components/CollectionItems';
import { ProductsProvider } from './contexts/ProductsContext';

function App() {
    return (
        <Router>
            <ProductsProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/select-products" element={<SelectProducts />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/select-sites/:id" element={<SelectSites />} />
                    <Route path="/learn-more" element={<LearnMore />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/collections/:collectionName" element={<CollectionItems />} />
                </Routes>
            </ProductsProvider>
        </Router>
    );
}

export default App;
