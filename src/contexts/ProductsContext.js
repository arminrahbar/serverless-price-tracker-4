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

    // Initialize favorites as an empty set, do not load from session storage
    const [favorites, setFavorites] = useState(new Set());

    // Initialize collections
    const [collections, setCollections] = useState([
        { name: 'All Items', items: [] }, // Default collection
    ]);

    // Save favorites to session storage whenever it changes, but do not load on refresh
    useEffect(() => {
        sessionStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    }, [favorites]);

    // Clear session storage on load to reset favorites every time the page refreshes
    useEffect(() => {
        sessionStorage.removeItem('favorites');  // Clear favorites at the start of the session
    }, []);

    // Function to create a new collection
    const createCollection = (name) => {
        setCollections((prevCollections) => [
            ...prevCollections,
            { name, items: [] },
        ]);
    };

    const addToCollection = (collectionName, item) => {
        setCollections(prevCollections => {
            let updatedCollections = prevCollections.map(collection => {
                if (collection.name === collectionName) {
                    const isInCollection = collection.items.some(i => i.id === item.id);
                    return {
                        ...collection,
                        items: isInCollection ? collection.items : [...collection.items, item],
                    };
                }
    
                if (collectionName !== "All Items" && collection.name === "All Items") {
                    // Add item to "All Items" only if it's being added to another collection
                    const isInAllItems = collection.items.some(i => i.id === item.id);
                    return {
                        ...collection,
                        items: isInAllItems ? collection.items : [...collection.items, item],
                    };
                }
    
                return collection; // Keep other collections as-is
            });
    
            // Add to favorites when item is added to any collection
            setFavorites((prev) => new Set(prev).add(item.id));
    
            return updatedCollections;
        });
    };

    const removeFromCollection = (collectionName, productId) => {
        setCollections((prevCollections) => {
            // Step 1: Remove the item from the specified collection
            const updatedCollections = prevCollections.map((collection) => {
                if (collection.name === collectionName) {
                    return {
                        ...collection,
                        items: collection.items.filter((item) => item.id !== productId),
                    };
                }
                return collection;
            });
    
            // Step 2: Check if the item is still in any other collections (excluding "All Items")
            const isInOtherCollections = updatedCollections
                .filter((collection) => collection.name !== 'All Items')
                .some((collection) => collection.items.some((item) => item.id === productId));
    
            // Step 3: If not in other collections, remove it from "All Items" and update favorites
            const finalCollections = updatedCollections.map((collection) => {
                if (collection.name === "All Items") {
                    return {
                        ...collection,
                        items: isInOtherCollections
                            ? collection.items
                            : collection.items.filter((item) => item.id !== productId),
                    };
                }
                return collection;
            });
    
            // Step 4: Update favorites state if item is removed from all collections
            setFavorites((prev) => {
                const updatedFavorites = new Set(prev);
                if (!isInOtherCollections) updatedFavorites.delete(productId);
                return updatedFavorites;
            });
    
            return finalCollections;
        });
    };
    
    return (
        <ProductsContext.Provider value={{
            products,
            setProducts,
            selectedProducts,
            setSelectedProducts,
            favorites,
            setFavorites,
            collections,
            setCollections,
            createCollection,
            addToCollection,
            removeFromCollection,
        }}>
            {children}
        </ProductsContext.Provider>
    );
};
