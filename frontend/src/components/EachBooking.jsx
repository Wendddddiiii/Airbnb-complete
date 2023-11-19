import React from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptBooking, declineBooking } from './PostListing';

const EachBooking = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <p>Status: {props.booking.status}</p>
      {props.booking.dateRange.map((range, index) => (
        <div key={index}>
          StartDate: {range.startDate}
          EndDate: {range.endDate}
        </div>
      ))}
      <br />
      {props.booking.status === 'pending' && (
        <div>
          <button onClick={() => {
            acceptBooking(props.booking.id);
            navigate('/showAllListing');
          }} type="button" className="btn btn-warning">Accept</button>
          <button onClick={() => {
            declineBooking(props.booking.id);
            navigate('/showAllListing');
          }} type="button" className="btn btn-warning">Decline</button>
        </div>
      )}
      <hr style={{ border: '1px solid grey', marginTop: '10px', marginBottom: '10px' }} />
    </>
  );
};

export default EachBooking;
