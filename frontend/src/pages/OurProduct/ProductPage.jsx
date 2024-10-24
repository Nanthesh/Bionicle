import React, { useState } from 'react';
import PrimarySearchAppBar from '../../components/Navbar.jsx';
import ProductCard from '../../components/Card.jsx';
import { Pagination, Box, Grid } from '@mui/material';
import ActiveLastBreadcrumb from '../../components/Breadcrumb.jsx';
import ExploreMenu from '../../components/ExploreMenu.jsx';

const products = [
  {
    id: 1,
    title: 'LED Bulb',
    description: 'Energy-saving LED bulb for home and office use.',
    image: 'path/to/bulb.jpeg',
    price: 10.99,
    category: 'Bulb', // Added category
  },
  {
    id: 2,
    title: 'Smartphone',
    description: 'Latest model with 5G connectivity and high-performance camera.',
    image: 'path/to/smartphone.jpeg',
    price: 699.99,
    category: 'Door Bell', // Added category
  },
  {
    id: 3,
    title: 'LED Bulb',
    description: 'Energy-saving LED bulb for home and office use.',
    image: 'path/to/bulb.jpeg',
    price: 10.99,
    category: 'Bulb', // Added category
  },
  {
    id: 4,
    title: 'Smartphone',
    description: 'Latest model with 5G connectivity and high-performance camera.',
    image: 'path/to/smartphone.jpeg',
    price: 699.99,
    category: 'Door Bell', // Added category
  },
  {
    id: 5,
    title: 'LED Bulb',
    description: 'Energy-saving LED bulb for home and office use.',
    image: 'path/to/bulb.jpeg',
    price: 10.99,
    category: 'Bulb', // Added category
  },
  {
    id: 6,
    title: 'Smartphone',
    description: 'Latest model with 5G connectivity and high-performance camera.',
    image: 'path/to/smartphone.jpeg',
    price: 699.99,
    category: 'Door Bell', // Added category
  },
  {
    id: 7,
    title: 'LED Bulb',
    description: 'Energy-saving LED bulb for home and office use.',
    image: 'path/to/bulb.jpeg',
    price: 10.99,
    category: 'Bulb', // Added category
  },
  {
    id: 8,
    title: 'Smartphone',
    description: 'Latest model with 5G connectivity and high-performance camera.',
    image: 'path/to/smartphone.jpeg',
    price: 699.99,
    category: 'Door Bell', // Added category
  },
  {
    id: 9,
    title: 'LED Bulb',
    description: 'Energy-saving LED bulb for home and office use.',
    image: 'path/to/bulb.jpeg',
    price: 10.99,
    category: 'Bulb', // Added category
  },
  {
    id: 10,
    title: 'Smartphone',
    description: 'Latest model with 5G connectivity and high-performance camera.',
    image: 'path/to/smartphone.jpeg',
    price: 699.99,
    category: 'Door Bell', // Added category
  },
];

const ProductPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('All'); // Default to "All"
  const productsPerPage = 8;

  // Filter products based on the selected category
  const filteredProducts = category === 'All'
    ? products
    : products.filter(product => product.category === category);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <PrimarySearchAppBar />
      <ActiveLastBreadcrumb />

      {/* ExploreMenu with category handling */}
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* Product Grid */}
      <Box sx={{ flexGrow: 1, padding: 2, marginBottom: '10px' }}>
        <Grid container spacing={1}>
          {currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard 
                title={product.title} 
                description={product.description} 
                image={product.image} 
                price={product.price} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default ProductPage;
