import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editHelper, bookListing, fetchBookings, deleteBookings } from './PostListing';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import RatingStars from './RatingStars';

const EachListing = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dateRanges, setDateRanges] = React.useState([{ startDate: null, endDate: null }]);
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');
  const [totalPrice, setTotalPrice] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const listingContainerStyle = {
    display: 'flex',
    width: '90%',
    alignItems: 'stretch',
    border: '1px solid #fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: '#fff',
    borderRadius: '5px'
  };

  const imageContainerStyle = {
    flex: '0 0 60%'
  };

  const textContainerStyle = {
    flex: '0 0 30%',
    padding: '10px'
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    objectFit: 'cover'
  };

  const navigate = useNavigate();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const addDateRange = () => {
    setDateRanges([...dateRanges, { startDate: null, endDate: null }]);
  };
  const updateDateRange = (index, field, value) => {
    const newDateRanges = [...dateRanges];
    newDateRanges[index][field] = new Date(value);
    setDateRanges(newDateRanges);
  };
  const handleSubmit = () => {
    const validRanges = dateRanges
      .filter(range => range.startDate && range.endDate)
      .map(range => ({
        startDate: range.startDate.toISOString(),
        endDate: range.endDate.toISOString()
      }));
    if (validRanges.length > 0) {
      console.log('Valid date ranges:', validRanges);
      bookListing(validRanges, totalPrice, props.listId).then(() => {
        handleClose();
        navigate('/');
      });
    } else {
      alert('Please select at least one valid date range.');
    }
  };
  useEffect(() => {
    if (token) {
      const pricePerStay = localStorage.getItem(`totalPrice-${props.listId}`);
      if (pricePerStay) {
        setTotalPrice(pricePerStay);
      }
      console.log('test2', pricePerStay);
      // console.log('test3', props.listing.reviews[0].comment);
      fetchBookings()
        .then(res => {
          const book = res.bookings.filter(booking => booking.listingId === props.listId);
          setBookings(book);
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
        });
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [token, props.listId]);
  const responsiveListingContainer = {
    ...listingContainerStyle,
    flexDirection: isMobile ? 'column' : 'row'
  };

  const responsiveImageContainer = {
    ...imageContainerStyle,
    flex: isMobile ? '0 0 100%' : '0 0 60%'
  };

  const responsiveTextContainer = {
    ...textContainerStyle,
    flex: isMobile ? '0 0 100%' : '0 0 30%'
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(); // Convert to a readable date format
  };
  const totalRating = props.listing.reviews.reduce((acc, review) => acc + review.rating.rating, 0);
  const averageRating = props.listing.reviews.length > 0 ? totalRating / props.listing.reviews.length : 0;
  // console.log('totalrating', totalRating);
  // console.log('average', averageRating);
  return (
    <>
      <div key={props.listing.id} style={responsiveListingContainer}>
          <div style={responsiveImageContainer}>
            <img src={props.listing.thumbnail} alt={props.listing.title} style={imageStyle} />
          </div>
          <div style={responsiveTextContainer}>
            <h1>Title: {props.listing.title}</h1>
            <p>Address: {props.listing.address}</p>
            <p>Bedrooms: {props.listing.metadata.numBedroom}</p>
            <p>Beds: {props.listing.metadata.numBed}</p>
            <p>Bathrooms: {props.listing.metadata.numBathroom}</p>
            <p>Amenities: {props.listing.metadata.amenities}</p>
            <p>Total Price(per stay): ${totalPrice}</p>
            <p>Type: {props.listing.metadata.type}</p>
            <p>&#x2B50;Total Reviews: {props.listing.reviews.length}</p>
            <div>Review rating: <RatingStars rating={averageRating} /></div>
            {token !== null && (
              <>
                <div>
                  <h4>Booking History Display:</h4>
                  {bookings.map((booking, idx) => (
                    <div key={idx}>
                      {booking.dateRange.map((range, index) => (
                        <div key={index}>
                          StartDate: {formatDate(range.startDate)},
                          EndDate: {formatDate(range.endDate)},
                          Status: {booking.status}<br />
                          {booking.status === 'accepted'
                            ? <button onClick={e => navigate(`/writeReview/${booking.id}/${booking.listingId}`)}type="button" className="btn btn-warning">Write a Review</button>
                            : <button onClick={e => {
                              deleteBookings(booking.id)
                              navigate('/dashboard');
                            }} type="button" className="btn btn-warning">Delete Booking</button>
                          }
                          <hr style={{ border: '1px solid grey', marginTop: '10px', marginBottom: '10px' }} />
                        </div>
                      ))}<br />
                    </div>
                  ))}<br />
                </div>
                <button onClick={handleOpen} type="button" className="btn btn-warning">Make a New Booking</button>
              </>
            )}

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <h2>Booking Date Ranges:</h2><br />
                {dateRanges.map((range, index) => (
                <div key={index}>
                  Start Date: <input type='date' onChange={e => updateDateRange(index, 'startDate', e.target.value)}></input><br /><br />
                  End Date: <input type='date' onChange={e => updateDateRange(index, 'endDate', e.target.value)}></input><br /><br />
                </div>
                ))}
                <button onClick={addDateRange} type="button" className="btn btn-warning">More Dates</button><br /><br />
                <button onClick={handleSubmit} type="button" className="btn btn-warning">Submit</button>
                <button onClick={handleClose} type="button" className="btn btn-warning">Cancel</button>
              </Box>
            </Modal>
          </div>
      </div>
    </>
  )
}

const SelectListing = () => {
  const { listId } = useParams();
  const [listing, setListing] = useState();
  useEffect(() => {
    editHelper(listId)
      .then(res => {
        setListing(res.listing);
        console.log(res.listing);
      })
  }, []);
  return (
    <>
    {listing !== undefined
      ? <EachListing listing={listing} listId={listId}/>
      : <></>
    }
    </>
  );
}

export default SelectListing;
