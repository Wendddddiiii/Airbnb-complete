import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookings, editHelper } from './PostListing';
import EachBooking from './EachBooking';

const ViewBookings = () => {
  const { listId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [profit, setProfit] = useState(0);
  const [postedDuration, setPostedDuration] = useState('');
  const [totalAcceptedDuration, setTotalAcceptedDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingResponse = await editHelper(listId);
        if (listingResponse && listingResponse.listing) {
          const { price, postedOn } = listingResponse.listing;
          const postedDate = new Date(postedOn);
          const currentDate = new Date();
          const differenceInTime = currentDate - postedDate;
          const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
          setPostedDuration(`${differenceInDays} days`);
          setProfit(price);
        }

        const bookingsResponse = await fetchBookings();
        if (bookingsResponse && bookingsResponse.bookings) {
          const validBookings = bookingsResponse.bookings.filter(booking => booking.listingId === listId);
          setBookings(validBookings);

          const totalDuration = validBookings.reduce((total, booking) => {
            if (booking.status === 'accepted') {
              return total + booking.dateRange.reduce((rangeTotal, range) => {
                const startDate = new Date(range.startDate);
                const endDate = new Date(range.endDate);
                return rangeTotal + (endDate - startDate) / (1000 * 3600 * 24);
              }, 0);
            }
            return total;
          }, 0);

          setTotalAcceptedDuration(Math.floor(totalDuration));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [listId]);

  return (
    <>
      <h2>Has been posted: {postedDuration}</h2>
      <h2>Total Days Booked This Year: {totalAcceptedDuration} days</h2>
      <h2>Total Profits Made This Year: ${totalAcceptedDuration * profit}</h2>
      <h4>Display booking request & history</h4>
      {bookings.length > 0
        ? bookings.map((booking, idx) => <EachBooking key={idx} booking={booking} />)
        : <p>Loading bookings...</p>
      }
    </>
  );
};

export default ViewBookings;
