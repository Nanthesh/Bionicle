import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DetailsThumb from '../../components/DetailsThumb';
import PrimarySearchAppBar from '../../components/Navbar.jsx';
import ActiveLastBreadcrumb from '../../components/Breadcrumb.jsx';
import Footer from '../../components/Footer.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const myRef = React.createRef();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = sessionStorage.getItem('token');
  
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`, {
          headers: {

            Authorization: `Bearer ${token}`,
          }
        });
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  const handleAddToCart = (event) => {
    event.stopPropagation();
  
    // Check if product data is available
    if (!product) {
      toast.error('Product details are not available.');
      console.error('Product data is missing:', product);
      return;
    }
  
    // Use the correct identifier (id or _id based on your API response)
    const productId = product.id || product._id;
  
    // Ensure the product ID exists
    if (!productId) {
      toast.error('Invalid product ID.');
      console.error('Invalid product ID:', productId);
      return;
    }
  
    // Get the current cart items from localStorage
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Current cart before update:', currentCart);
  
    // Find if the product is already in the cart
    const existingItemIndex = currentCart.findIndex((item) => item.id === productId);
  
    if (existingItemIndex >= 0) {
      // Update the quantity if the product already exists in the cart
      currentCart[existingItemIndex].quantity += 1;
      console.log(`Increased quantity for product ID ${productId}`);
    } else {
      // Add the new product to the cart
      currentCart.push({
        id: productId,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      console.log(`Added new product to cart: ${product.title}`);
    }
  
    // Save the updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(currentCart));
    console.log('Updated cart:', currentCart);
  
    // Show success notification
    toast.success(`${product.title} has been added to your cart!`, {
      position: 'top-center',
      autoClose: 1500,
      theme: 'colored',
    });
  
    // Emit custom event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };
  

  const handleTab = (index) => {
    // handle image tab switching
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  

  return (
    <>
      <PrimarySearchAppBar setSearchQuery={setSearchQuery} />
      <ActiveLastBreadcrumb />
      <div style={styles.app}>
        {product && (
          <div style={styles.details}>
            <div style={styles.bigImg}>
              {/* <img src={product.image[0]} alt={product.title} style={styles.image} /> */}
              <img src={product.image} alt={product.title} style={styles.image} />
            </div>

            <div style={styles.box}>
              <div style={styles.row}>
                <h2 style={styles.title}>{product.title}</h2>
                <span style={styles.price}>${product.price}</span>
              </div>
              <p style={styles.category}>{product.category}</p>
              <p style={styles.description}>{product.description}</p>
              <p style={styles.stock}>Stock: {product.stock_quantity}</p>

              <DetailsThumb
                images={Array.isArray(product.image) ? product.image : [product.image]} 
                tab={handleTab} 
                myRef={myRef}
              />
              <Link to ='/cart'>
              <button style={styles.cart} onClick={handleAddToCart}>Add to cart</button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const styles = {
  app: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0',
    backgroundColor: '#f7f7f7',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    padding: '30px',
  },
  bigImg: {
    flex: '1',
    paddingRight: '20px',
    marginBottom: '20px', // Added margin for spacing
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  box: {
    flex: '1.5',
    paddingLeft: '60px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ff5722',
  },
  category: {
    fontSize: '1.1rem',
    color: '#757575',
    marginTop: '5px',
    marginBottom: '10px', // Added margin for spacing
  },
  description: {
    fontSize: '1rem',
    color: '#333',
    lineHeight: '1.5',
    marginTop: '10px',
    marginBottom: '20px', // Added margin for spacing
  },
  stock: {
    fontSize: '1.1rem',
    color: '#4caf50',
    marginTop: '5px',
  },
  cart: {
    backgroundColor: '#ff5722',
    padding: '15px 30px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1.2rem',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    marginTop: '20px', // Added margin for spacing from the description
  },
};

export default ProductDetail;
