import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUpForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/:role" element={<SignUpForm />} />
        <Route path="/dashboard/:role" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
