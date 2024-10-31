import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Register/Signup';  
import Signin from './pages/Login/Signin';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import ProductPage from './pages/OurProduct/ProductPage';
import Dashboard from './pages/Dashboard/Dashboard';
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Signup />} />

          <Route path="/signin" element={<Signin/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ForgotPassword" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} /> 
          <Route path='/product_page' element={<ProductPage/>} />
          <Route path='/dashboard' element={<Dashboard/>} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;