import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Register/Signup';  
import Signin from './pages/Login/Signin';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import DeviceManagementPage from './pages/DeviceManagementPage/DeviceManagementPage';
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
          <Route path="/device_management_page" element={<DeviceManagementPage/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;