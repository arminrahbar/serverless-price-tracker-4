import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Home.css';
import { useProducts } from '../contexts/ProductsContext';

function SelectSites() {
    const { products, setProducts } = useProducts(); // Access products and update function from context
    const { id } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate();
    const [newlySelected, setNewlySelected] = useState(new Set()); // Track newly selected sites

    // Find the product by ID
    const product = products.find(p => p.id === parseInt(id));

    console.log('Initial selectedSites in SelectSites:', product.selectedSites); // Debugging output

    // Filter out the first site and any sites already selected in ProductDetails
    const unselectedSites = product.sites.filter(
        site => !product.selectedSites?.some(s => s.site === site.site)  // Remove sites that are already selected
    );

    const handleCheckboxChange = (siteName) => {
        setNewlySelected(prev => {
            const updated = new Set(prev);
            if (updated.has(siteName)) {
                updated.delete(siteName); // Remove if already selected
            } else {
                updated.add(siteName); // Add if not selected
            }
            return updated;
        });
    };

    // Render available (unselected) sites for selection
    const renderSites = () => {
        return unselectedSites.map((site, index) => (
            <div key={index} className="item">
                <input
                    type="checkbox"
                    id={`site-${site.site}`} // Use site name as ID
                    checked={newlySelected.has(site.site)} // Check if site is newly selected
                    onChange={() => handleCheckboxChange(site.site)} // Handle checkbox toggle
                />
                <label htmlFor={`site-${site.site}`}>{site.site}: ${site.price}</label>
            </div>
        ));
    };

    // Handle "Done" button click
    const handleDone = () => {
        // Find the newly selected sites
        const newSelections = product.sites.filter(site => newlySelected.has(site.site));

        // Update the product's selected sites to include newly selected ones
        const updatedProduct = { 
            ...product, 
            selectedSites: product.selectedSites 
                ? [...product.selectedSites, ...newSelections] 
                : [...newSelections] 
        };

        // Update the context with the modified product
        setProducts(prevProducts => prevProducts.map(p => p.id === product.id ? updatedProduct : p));

        // Navigate back to the product detail page
        navigate(`/product/${id}`);
    };

    return (
        <div className="container">
            <h2>New Sites</h2>
            {renderSites()} {/* Render unselected sites for selection */}
            <button className="btn" onClick={handleDone}>Done</button>
        </div>
    );
}

export default SelectSites;
