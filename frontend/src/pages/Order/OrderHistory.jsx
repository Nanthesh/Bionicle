import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import InvoiceGenerator from '../../components/InvoiceGenerator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const token = sessionStorage.getItem('token');

    // Fetch orders from the API with Authorization header
    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/orders/user/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Sort orders by order_date in descending order (most recent first)
            const sortedOrders = response.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
    
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Format order date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleAddToCart = (product) => {
        const userEmail = sessionStorage.getItem('userEmail');
        if (!userEmail) {
            toast.error('User email not found. Please log in.');
            return;
        }
    
        // Get current cart items from localStorage
        const currentCart = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
    
        // Check if the product is already in the cart
        const existingItem = currentCart.find(item => item.id === product.id);
    
        if (existingItem) {
            // If the item already exists, update its quantity
            existingItem.quantity += 1;
        } else {
            // If the item does not exist, add it to the cart with quantity 1
            currentCart.push({ ...product, quantity: 1 });
        }
    
        // Save updated cart to localStorage
        localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(currentCart));
    
        // Notify user
        toast.success(`${product.title} has been added to your cart!`, {
            position: "top-center",
            autoClose: 1500,
            theme: "colored",
        });
    
        // Emit custom event for cart update
        window.dispatchEvent(new Event('cartUpdated'));
    };
    
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flex: 1 }}>
                <Navbar />
                <Box
                    sx={{
                        p: 3,
                        maxWidth: { xs: '100%', sm: '600px', md: '800px' },
                        margin: 'auto',
                        padding: { xs: 2, sm: 3 },
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Order History
                    </Typography>
                    {orders.length === 0 ? (
                        <Typography>No orders found.</Typography>
                    ) : (
                        orders.map((order) => (
                            <Card key={order._id} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box>
                                            <Typography variant="subtitle1">
                                                <strong>Order Placed:</strong> {formatDate(order.order_date)}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                <strong>Total:</strong> ${order.total_price.toFixed(2)}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                <strong>Ship To:</strong> Javier Armando Martínez Pineda
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                <strong>Shipping Address:</strong> {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.zipCode}, {order.shipping_address.country}
                                            </Typography>
                                        </Box>
                                        <InvoiceGenerator order={order} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    {order.products.map((item) => (
                                        <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box
                                                component="img"
                                                src={item.product_id.image}
                                                alt={item.product_id.title}
                                                sx={{
                                                    width: { xs: '80px', sm: '100px' },
                                                    height: { xs: '80px', sm: '100px' },
                                                    borderRadius: 2,
                                                    objectFit: 'contain',
                                                    mr: 2,
                                                    boxShadow: 2,
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ color: '#007185', textDecoration: 'none' }}>
                                                    {item.product_id.title}
                                                </Typography>
                                                <Typography>{item.product_id.description}</Typography>
                                                <Typography>
                                                    <strong>Quantity:</strong> {item.quantity}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#5D3FD3',
                                                        color: '#fff',
                                                        borderRadius: '50px',
                                                        padding: '2px 12px',
                                                        fontSize: '10px',
                                                        minWidth: 'auto',
                                                        ':hover': {
                                                            backgroundColor: '#4b2fc4',
                                                        },
                                                    }}
                                                    onClick={() => handleAddToCart({
                                                        title: item.product_id.title,
                                                        description: item.product_id.description,
                                                        image: item.product_id.image,
                                                        price: item.product_id.price,
                                                        id: item.product_id._id,
                                                    })}
                                                >
                                                    Buy it again
                                                </Button>
                                                     <Button
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            color: '#5D3FD3',
                                                            borderColor: '#5D3FD3',
                                                            borderRadius: '50px',
                                                            padding: '2px 12px',
                                                            fontSize: '10px',
                                                            minWidth: 'auto',
                                                            ':hover': {
                                                                color: '#fff',
                                                                backgroundColor: '#5D3FD3',
                                                                borderColor: '#4b2fc4',
                                                            },
                                                        }}
                                                        component={Link}
                                                        to={`/product_page/${item.product_id._id}`}
                                                    >
                                                        View your item
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}

                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </Box>
            <ToastContainer
            position="top-center"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        </Box>
    );
};

export default OrderHistory;