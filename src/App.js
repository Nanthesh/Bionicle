import React from 'react';
<<<<<<< HEAD
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Components/Signin'; 

const App = () => {
  return (
<Signin/>
  );
};

=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Register/Signup';  
import Signin from './pages/Login/Signin';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Signup />} />

          <Route path="/signin" element={<Signin/>} />

          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

>>>>>>> javier
export default App;
