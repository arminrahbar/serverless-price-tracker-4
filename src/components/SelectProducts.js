import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useProducts } from '../contexts/ProductsContext';

function SelectProducts() {
    const { products, selectedProducts, setSelectedProducts } = useProducts();
    const [newlySelected, setNewlySelected] = useState(new Set());
    const navigate = useNavigate();

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
        // Add newly selected products to the selectedProducts array
        const newSelections = products.filter(p => newlySelected.has(p.id));
        setSelectedProducts([...selectedProducts, ...newSelections]);
        navigate('/');
    };

    const renderProducts = () => {
        // Filter products that are not currently selected
        const unselectedProducts = products.filter(product => !selectedProducts.some(p => p.id === product.id));

        return unselectedProducts.map(product => (
            <div key={product.id} className="item">
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
        <div className="container">
            <h2>Products</h2>
            {renderProducts()}
            <button className="btn" onClick={handleDone}>Done</button>
        </div>
    );
}

export default SelectProducts;
