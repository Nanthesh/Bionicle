import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DetailsThumb from '../../components/DetailsThumb';
import PrimarySearchAppBar from '../../components/Navbar.jsx';
import ActiveLastBreadcrumb from '../../components/Breadcrumb.jsx';
import Footer from '../../components/Footer.jsx';
import { Link } from 'react-router-dom';

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
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
              <img src={product.image[0]} alt={product.title} style={styles.image} />
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
                images={product.image}
                tab={handleTab}
                myRef={myRef}
              />
              <Link to ='/cart'>
              <button style={styles.cart}>Add to cart</button>
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
