import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectProducts.css'; 
import { useProducts } from '../contexts/ProductsContext';  // Import context

function SelectProducts() {
    const { products, selectedProducts, setSelectedProducts } = useProducts();  // Use context to get selected products
    const [newlySelected, setNewlySelected] = useState(new Set());  // Track newly selected products
    const navigate = useNavigate();

    useEffect(() => {
        // No need to fetch products here; they should already be fetched in the Home component
    }, [products]);

    const handleCheckboxChange = (productId) => {
        setNewlySelected(prev => {
            const updated = new Set(prev);
            if (updated.has(productId)) {
                updated.delete(productId);
            } else {
                updated.add(productId);
            }
            return updated;
        });
    };

    const handleDone = () => {
        // Add newly selected products to the selectedProducts array, while keeping existing ones
        setSelectedProducts([...selectedProducts, ...products.filter(p => newlySelected.has(p.id))]);
        navigate('/');
    };

    const renderProducts = () => {
        // Exclude the first product from the SelectProducts list
        const unselectedProducts = products.slice(1).filter(product => !selectedProducts.some(p => p.id === product.id));
        return unselectedProducts.map(product => (
            <div key={product.id} className="select-product-item">
                <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    checked={newlySelected.has(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                />
                <label htmlFor={`product-${product.id}`}>{product.name}</label>
            </div>
        ));
    };

    return (
        <div className="select-products-container">
            <h1>Select Products</h1>
            {renderProducts()}
            <button className="action-button" onClick={handleDone}>Done</button>
        </div>
    );
}

export default SelectProducts;
