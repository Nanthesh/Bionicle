import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Signup from './pages/Register/Signup';  
import Signin from './pages/Login/Signin';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import UserProfile from './pages/UserProfile/UserProfile';
import ProductPage from './pages/OurProduct/ProductPage';
import Dashboard from './pages/Dashboard/Dashboard';
import AddDevice from "./pages/AddDevice/AddDevices";
import ProtectedRoute from './components/ProtectedRoute';
import CheckAuth from './components/checkAuth';
import NotFoundPage from './pages/Login/NotFoundPage';
import DeviceManagementPage from './pages/DeviceManagementPage/DeviceManagementPage';
import Cart from './pages/OurProduct/Cart';
import Wishlist from './pages/OurProduct/Wishlist';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Checkout from './pages/Checkout/Checkout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import EnergyCalculation from './pages/EnergyCalculation/EnergyCalculation';
import OrderHistory from './pages/Order/OrderHistory';

const App = () => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  return (
    
    <Router>
    <AuthProvider>
        <Routes>
          <Route path="/" element={<><CheckAuth /><Signin /></>} />

          <Route path="/signin"  element={<><CheckAuth /><Signin /></>} />
          <Route path="/signup"  element={<Signup/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} /> 
           {/* Catch-all route for undefined paths */}
           <Route path="*" element={<NotFoundPage />} />
           {/* protected routes */}
          <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/product_page" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-device" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />
          <Route path="/device_management_page" element={<ProtectedRoute><DeviceManagementPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/product_page/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/checkout" element={<Elements stripe={stripePromise}><ProtectedRoute><Checkout /></ProtectedRoute></Elements>} />
          <Route path="/energycalculator" element={<EnergyCalculation/> }/>
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        </Routes>
       </AuthProvider>
    </Router>

  );
};

export default App;