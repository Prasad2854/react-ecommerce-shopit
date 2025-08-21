import React, { createContext, useState, useEffect, useContext } from 'react';

const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch from the public FakeStoreAPI
                const response = await fetch('https://fakestoreapi.com/products');
                const data = await response.json();
                
                // The API returns full product objects
                setProducts(data);

                // Derive categories from the product data
                const uniqueCategories = [...new Set(data.map(p => p.category))];
                setCategories(uniqueCategories);

            } catch (error) {
                console.error("Failed to fetch products from FakeStoreAPI:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const value = { products, categories, isLoading };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
