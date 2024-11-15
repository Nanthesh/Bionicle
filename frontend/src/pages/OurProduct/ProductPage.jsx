import React, { useState ,useEffect } from 'react';
import PrimarySearchAppBar from '../../components/Navbar.jsx';
import ProductCard from '../../components/Card.jsx';
import { Pagination, Box, Grid, Typography } from '@mui/material';
import ActiveLastBreadcrumb from '../../components/Breadcrumb.jsx';
import ExploreMenu from '../../components/ExploreMenu.jsx';
import axios from 'axios';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../../components/Footer.jsx"




const ProductPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(''); // Add state for search query
    const productsPerPage = 8;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('All');

    useEffect(() => {
      // Fetch products from the API when the component mounts
      const fetchProducts = async () => {
        try {
          const token = sessionStorage.getItem('token');
          const response = await axios.get('http://localhost:4000/api/products', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setProducts(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to load products.');
          setLoading(false);
        }
      };
      fetchProducts();
    }, []);
  
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  
    // Filter products based on search query
    const filteredProducts = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  
    const currentProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
  
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

    if (loading) {
      return (
        <Typography variant="h6" align="center" sx={{ width: '100%', mt: 4 }}>
          Loading products...
        </Typography>
      );
    }
    if (error) {
      return (
        <Typography variant="h6" align="center" sx={{ width: '100%', mt: 4, color: 'red' }}>
          {error}
        </Typography>
      );
    }

    return (
      <div>
        
      <PrimarySearchAppBar setSearchQuery={setSearchQuery} />
      <ActiveLastBreadcrumb />
      <ExploreMenu category={category} setCategory={setCategory} />
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2, marginBottom: '10px' }}>
        <Grid container spacing={2}>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard
                  title={product.title}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  id={product._id}
                  sx={{
                    height: '100%', // Ensure the card takes the full height of the grid item
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ width: '100%' }}>
              No products found.
            </Typography>
          )}
        </Grid>
      </Box>
    
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>

      <Footer />
    </div>
    
    );
  };
  
  export default ProductPage;