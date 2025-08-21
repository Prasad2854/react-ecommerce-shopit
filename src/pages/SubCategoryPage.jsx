import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data/mockData';
import './SubCategoryPage.css';

const SubCategoryPage = () => {
    // Get the main category ID from the URL (e.g., 'electronics')
    const { categoryId } = useParams();

    // Find the current category from our data
    const currentCategory = categories.find(cat => cat.id === categoryId);

    if (!currentCategory || !currentCategory.subCategories) {
        return <div>Category not found!</div>;
    }

    return (
        <div className="subcategory-page-container">
            <h1 className="subcategory-title">Shop {currentCategory.name}</h1>
            <div className="subcategory-grid">
                {currentCategory.subCategories.map(subCategory => (
                    <Link to={`/category/${categoryId}/${subCategory.id}`} key={subCategory.id} className="subcategory-card-link">
                        <div className="subcategory-card">
                            <span>{subCategory.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryPage;