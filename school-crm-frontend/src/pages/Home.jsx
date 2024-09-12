import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-4">Welcome to Academy</h2>
          <p className="text-lg mb-6">Your journey towards a brighter future begins here. Manage your classes, students, and teachers effortlessly with our platform.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-700 transition duration-300">Log In</Link>
            <Link to="/signup/student" className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition duration-300">Sign Up as Student</Link>
            <Link to="/signup/teacher" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">Sign Up as Teacher</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
