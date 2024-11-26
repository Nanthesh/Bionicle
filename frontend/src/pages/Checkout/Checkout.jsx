import React, { useState, useEffect,useRef  } from 'react';
import {
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  FormControl,
  OutlinedInput,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  FormLabel,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AddressForm from '../../components/AddressForm';
import Info from '../../components/Info';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Logo from '../../assets/Logo.jpeg';
import visaLogo from '../../assets/visa-logo.png';
import mastercardLogo from '../../assets/mastercard-logo.png';
import amexLogo from '../../assets/amex-logo.png';
import defaultLogo from '../../assets/default-card-logo.png';
import { styled } from '@mui/system';
import CheckoutNavbar from '../../components/CheckoutNavbar';

const steps = ['Shipping address', 'Payment & Review'];
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [addressData, setAddressData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardName, setCardName] = useState('');
  const [isCardSaved, setIsCardSaved] = useState(false);
  const [maskedCardNumber, setMaskedCardNumber] = useState('');
  const [error, setError] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const navigate = useNavigate();
  const validateAllFieldsRef = useRef(null);
  
  const stripe = useStripe();
  const elements = useElements();
  const userEmail = sessionStorage.getItem('userEmail');

  // Load cart items and total price
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`)) || [];
    const total = storedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    setCartItems(storedItems);
    setTotalPrice(total);
  }, []);

  useEffect(() => {
    // Check if cart data exists in localStorage
    const cartData = JSON.parse(localStorage.getItem(`cartItems_${userEmail}`));
  
    // If cart is empty or null, redirect to the cart page
    if (!cartData || cartData.length === 0) {
      toast.warning('Your cart is empty. Redirecting to the cart page.');
      navigate('/cart');
    }
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Trigger address form validation
      if (validateAllFieldsRef.current && !validateAllFieldsRef.current()) {
        toast.error('Please correct the errors in the address form before proceeding.');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleCardNameChange = (event) => {
    setCardName(event.target.value);
    setIsPaymentValid(event.target.value.trim() !== '');
  };

  const createPaymentMethod = async () => {
    if (!stripe || !elements) {
      toast.error("Payment elements not available. Please try again.");
      return;
    }
  
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      toast.error("Payment method not available. Please try again.");
      return;
    }
  
    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name: cardName },
      });
  
      if (error) {
        toast.error(`Failed to save card: ${error.message}`);
        return;
      }
  
      const last4Digits = paymentMethod?.card?.last4 || '****';
      const brand = paymentMethod?.card?.brand || 'Unknown';
      const expMonth = paymentMethod?.card?.exp_month || 'MM';
      const expYear = paymentMethod?.card?.exp_year || 'YY';
  
      // Actualizar el estado con los datos enmascarados
      setPaymentData({
        brand,
        cardNumber: `****-****-****-${last4Digits}`,
        expiryDate: `${expMonth}/${expYear}`,
        paymentMethodId: paymentMethod.id,
      });
  
      // Cambiar `isCardSaved` a `true`
      setIsCardSaved(true);
      toast.success("Card saved successfully!");
    } catch (error) {
      toast.error(`Error saving card: ${error.message}`);
    }
  };
  

  const removePaymentMethod = () => {
    setIsCardSaved(false);
    setMaskedCardNumber('');
    setCardName('');
  };

  const handlePlaceOrder = async () => {
    if (!stripe) {
      toast.error("Payment processing is not available. Please try again.");
      return;
    }
  
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error("User authentication failed. Please log in.");
        return;
      }
  
      // Step 1: Create Payment Intent
      const createPaymentIntentResponse = await axios.post(
        'http://localhost:4000/api/payments/create-payment-intent',
        {
          amount: (totalPrice * 100).toFixed(0),
          currency: 'usd',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const clientSecret = createPaymentIntentResponse.data.clientSecret;
  
      // Step 2: Confirm Payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentData.paymentMethodId,
      });
  
      if (error) {
        toast.error(`Payment failed: ${error.message}`);
        return;
      }
  
      if (paymentIntent?.status !== 'succeeded') {
        toast.error(`Payment did not succeed. Status: ${paymentIntent?.status}`);
        return;
      }
  
      // Step 3: Prepare Order Data with product_id included
      const orderData = {
        products: cartItems.map(item => ({
          product_id: item.product_id || item.id, // Include product_id or fallback to item.id
          quantity: item.quantity,
        })),
        shipping_address: {
          address: addressData.address1,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zip,
          country: addressData.country,
        },
      };
  
      console.log('Order data being sent:', orderData); // Debug log
  
      // Step 4: Create Order
      const createOrderResponse = await axios.post(
        'http://localhost:4000/api/orders',
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (createOrderResponse.status === 201) {
        toast.success('Order placed successfully!');
        setOrderCompleted(true);
        localStorage.removeItem(`cartItems_${userEmail}`);
      } else {
        toast.error('Order creation failed. Please try again.');
      }
    } catch (error) {
      toast.error(`Order creation failed: ${error.response.data.error}`);
    }
  };
  
  const getCardLogo = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return visaLogo;
      case 'mastercard':
        return mastercardLogo;
      case 'american express':
        return amexLogo;
      default:
        return defaultLogo;
    }
  };
  

  
  return (
    <>
    {/* Checkout Navbar */}
    <CheckoutNavbar />

    <Box sx={{ display: 'flex', height: '100vh', padding: 2 }}>
      {/* Fixed Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: { xs: '100%', sm: '280px' },
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          padding: 4,
          overflowY: 'auto',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <img src={Logo} alt="Logo" style={{ width: '70px', height: '70px', borderRadius: '50%' }} />
          <Typography variant="h5">EcosysTech</Typography>
        </Box>
        <Info />
      </Box>

      {/* Main Checkout Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, sm: '280px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          maxWidth: '1300px',
          width: '100%',
          padding: { xs: 2, md: 4 },
          overflowY: 'auto',
        }}
      >
        <ToastContainer position="bottom-right" autoClose={3000} />
        <Stepper activeStep={activeStep} sx={{ width: '100%', maxWidth: '800px', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
    {orderCompleted ? (
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: 600,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Typography variant="h1">📦</Typography>
              <Typography variant="h5">Thank you for your order!</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  window.location.href = '/orders';
                }}
                sx={{
                  backgroundColor: 'black',
                  textTransform: 'none',
                  borderRadius: '20px',
                  padding: '8px 24px',
                  ':hover': {
                    backgroundColor: '#5a52cc',
                  },
                }}
              >
                Go to my orders
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            {/* Step 0: Address Form */}
            {activeStep === 0 && <AddressForm   setAddressData={setAddressData} setErrorCount={setErrorCount}  setActiveStep={setActiveStep} validateAllFieldsExternal={(validateAllFields) => {
                validateAllFieldsRef.current = validateAllFields;
              }} />}

            {/* Step 1: Payment Form and Review Order */}
            {activeStep === 1 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  maxWidth: '1200px',
                  margin: '0 auto',
                }}
              >
                {/* Your Payment Form and Order Review Sections */}
                  {/* Payment Form Section */}
          <Box
            sx={{
              flex: 1,
              minWidth: '500px',
              backgroundColor: '#ffffff',
              padding: 3,
              borderRadius: '16px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
              overflowY: 'auto',
              maxHeight: '550px',
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ position: 'relative', mb: 2 }}>
              {paymentData?.brand && (
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <img
                    src={getCardLogo(paymentData?.brand)}
                    alt="Card Logo"
                    style={{ width: '40px', height: 'auto' }}
                  />
                </Box>
              )}
              <Typography variant="h6">Credit Card Payment</Typography>
            </Box>

            {isCardSaved ? (
              <>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Cardholder Name: {cardName}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Card Number: {paymentData?.cardNumber}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Expiration Date: {paymentData?.expiryDate}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={removePaymentMethod}
                  sx={{ mb: 2 }}
                >
                  Remove Card
                </Button>
              </>
            ) : (
              <>
              <FormControl component="fieldset" fullWidth>
                <FormLabel htmlFor="card-name" required>
                  Cardholder Name
                </FormLabel>
                <OutlinedInput
                  id="card-name"
                  placeholder="John Smith"
                  value={cardName}
                  onChange={handleCardNameChange}
                  size="small"
                  fullWidth
                  disabled={isCardSaved}
                  sx={{ mb: 2 }}
                />

                {isCardSaved ? (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Card Number: {paymentData?.cardNumber}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Expiry Date: {paymentData?.expiryDate}
                    </Typography>
                    <img
                      src={getCardLogo(paymentData?.brand)}
                      alt="Card Logo"
                      style={{ width: '40px', height: 'auto', marginBottom: '16px' }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={removePaymentMethod}
                      sx={{ mb: 2 ,borderRadius: '20px',padding: '8px 24px',}}
                    >
                      Remove Card
                    </Button>
                  </>
                ) : (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Card Number</Typography>
                      <CardNumberElement />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Expiration Date</Typography>
                      <CardExpiryElement />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">CVC</Typography>
                      <CardCvcElement />
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Button variant="contained" color="primary" fullWidth={false} onClick={createPaymentMethod}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      padding: '8px 24px',
                      borderRadius: '20px',
                      backgroundColor: 'Black', 
                      textTransform: 'none', // Keeps the text as is, without capitalization
                      ':hover': {
                        backgroundColor: '#5a52cc', // Darker shade on hover
                      },
                      display: 'block',
                      margin: '0 auto', // Centers the button horizontally
                    }}
                    >
                      Save Card
                    </Button>

                  </>
                )}
              </FormControl>


              </>
            )}
          </Box>


        {/* Order Review Section */}
        <Box 
  sx={{
    flex: 1,
    minWidth: '450px',
    backgroundColor: '#ffffff',
    padding: 3,
    borderRadius: '16px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0',
  }}
>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Review Your Order
  </Typography>

  {/* Order Summary */}
  <List disablePadding>
    {cartItems.map((item) => (
      <ListItem key={item.id}>
        <ListItemText primary={item.title} secondary={`Quantity: ${item.quantity}`} />
        <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
      </ListItem>
    ))}
    <ListItem>
      <ListItemText primary="Subtotal" />
      <Typography>${totalPrice}</Typography>
    </ListItem>
    <ListItem>
      <ListItemText primary="Shipping Charges" />
      <Typography>$0.00</Typography>
    </ListItem>
    <ListItem>
      <ListItemText primary="Estimated GST/HST" />
      <Typography>${(totalPrice * 0.13).toFixed(2)}</Typography>
    </ListItem>
    <ListItem>
      <ListItemText primary="Total" />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        ${(totalPrice * 1.13).toFixed(2)}
      </Typography>
    </ListItem>
  </List>

  {/* Address Section */}
  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
    Shipping Address
  </Typography>
  <Box sx={{ mb: 3 }}>
    <Typography variant="body2">
      {addressData?.firstName} {addressData?.lastName}
    </Typography>
    <Typography variant="body2">{addressData?.address1}</Typography>
    <Typography variant="body2">
      {addressData?.city}, {addressData?.state}, {addressData?.zip}
    </Typography>
    <Typography variant="body2">{addressData?.country}</Typography>
  </Box>
</Box>

      </Box>
    )}
            

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, width: '100%', maxWidth: '900px' }}>

              {activeStep < steps.length - 1 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button
                  id="placeOrderButton"
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceOrder}
                  disabled={!isCardSaved}
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    padding: '8px 24px',
                    borderRadius: '20px',
                    backgroundColor: 'black',
                    textTransform: 'none',
                    ':hover': {
                      backgroundColor: '#5a52cc',
                    },
                    display: 'block',
                  }}
                >
                  Place Order
                </Button>
              )}
            </Box>

          </>
        )}
      </Box>
    </Box>
  </>
);
};

export default Checkout;
