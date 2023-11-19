import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* <button onClick={e => navigate('/showAllListing')} type="button" className="btn btn-warning active">All Listings</button> */}
      <button onClick={e => navigate('/createListing')}type="button" className="btn btn-warning active">Create A Listing</button>
    </>
  );
}

export default Dashboard;
