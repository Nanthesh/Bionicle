import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Signup from './pages/Register/Signup';  
import Signin from './pages/Login/Signin';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import UserProfile from './pages/UserProfile/UserProfile';
import ProductPage from './pages/OurProduct/ProductPage';
const App = () => {
  return (
    
    <Router>
    <AuthProvider>
        <Routes>
          <Route path="/" element={<><CheckAuth /><Signin /></>} />

          <Route path="/signin"  element={<><CheckAuth /><Signin /></>} />
          <Route path="/signup"  element={<Signup/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} /> 
          <Route path='/product_page' element={<ProductPage/>} />
        </Routes>
       </AuthProvider>
    </Router>

  );
};

export default App;