// import electronicsImage from '../assets/electronics.jpg';
// import fashionImage from '../assets/fashion.jpg'; // (Assuming you add these images too)
// import homeGoodsImage from '../assets/homegoods.jpg';
// import booksImage from '../assets/books.jpg';
// export const categories = [
//     { 
//         id: 'electronics', 
//         name: 'Electronics', 
//         imageUrl: electronicsImage 
//     },
//     { 
//         id: 'fashion', 
//         name: 'Fashion', 
//         imageUrl: fashionImage 
//     },
//     { 
//         id: 'home-goods', 
//         name: 'Home Goods', 
//         imageUrl: homeGoodsImage
//     },
//     { 
//         id: 'books', 
//         name: 'Books', 
//         imageUrl: booksImage
//     }
// ];

// src/data/mockData.js

export const categories = [
    { 
        id: 'electronics', 
        name: 'Electronics', 
        imageUrl: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        subCategories: [
            { id: 'smartphones', name: 'Smartphones' },
            { id: 'laptops', name: 'Laptops' },
            { id: 'headphones', name: 'Headphones' }
        ]
    },
    // ... (Add other categories with subCategories here)
];

export const products = {
    'smartphones': [
        { id: 101, name: 'iPhone 15 Pro', price: '₹1,34,900', rating: 4.8, query: 'iphone 15 pro' },
        { id: 102, name: 'Samsung Galaxy S23 Ultra', price: '₹1,24,999', rating: 4.7, query: 'samsung galaxy s23' },
        { id: 103, name: 'Google Pixel 8 Pro', price: '₹1,06,999', rating: 4.6, query: 'google pixel 8' },
    ],
    'laptops': [
        { id: 201, name: 'MacBook Air M2', price: '₹1,14,900', rating: 4.9, query: 'macbook air' },
        { id: 202, name: 'Dell XPS 15', price: '₹1,89,990', rating: 4.7, query: 'dell xps laptop' },
    ],
    'headphones': [
        { id: 301, name: 'Sony WH-1000XM5', price: '₹29,990', rating: 4.8, query: 'sony headphones' },
    ]
};