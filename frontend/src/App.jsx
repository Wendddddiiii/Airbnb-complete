import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import Header from './Header';
import Dashboard from './components/Dashboard';
import CreateListing from './components/CreateListing';
import ShowAllListings from './components/ShowAllListings';
import EditListings from './components/EditListings';
import LandingPage from './components/LandingPage';
import SelectListing from './components/SelectListing';
import ViewBookings from './components/ViewBookings';
import WriteReview from './components/WriteReview';
function App () {
// Check if a token is present in localStorage
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = useState(storedToken);

  return (
    <BrowserRouter>
      <Header token={token} setToken={setToken}/>
      <Routes>
        <Route path="/login" element={<SignInForm setToken={setToken} />} />
        <Route path="/register" element={<SignUpForm setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/showAllListing" element={<ShowAllListings />} />
        <Route path="/createListing" element={<CreateListing />} />
        <Route path="/editListing/:listId" element={<EditListings />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/selectListing/:listId" element={<SelectListing />} />
        <Route path="/viewBookings/:listId" element={<ViewBookings />} />
        <Route path="/writeReview/:bookingId/:listId" element={<WriteReview />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
