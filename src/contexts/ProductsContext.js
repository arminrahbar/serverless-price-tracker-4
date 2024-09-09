import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    
    // Initialize selectedProducts from local storage
    const [selectedProducts, setSelectedProducts] = useState(() => {
        const savedProducts = localStorage.getItem('selectedProducts');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });

    // Save selectedProducts to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    return (
        <ProductsContext.Provider value={{ products, setProducts, selectedProducts, setSelectedProducts }}>
            {children}
        </ProductsContext.Provider>
    );
};
