import React, { useEffect, useState } from 'react';
import { fetchListings, deleteListings, publishListings, unpublishListings } from './PostListing';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import RatingStars from './RatingStars';
export const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

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

const SingleList = ({ list }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dateRanges, setDateRanges] = React.useState([{ startDate: null, endDate: null }]);
  const [isPublished, setIsPublished] = React.useState(list.published);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const addDateRange = () => {
    setDateRanges([...dateRanges, { startDate: null, endDate: null }]);
  };

  const updateDateRange = (index, field, value) => {
    const newDateRanges = [...dateRanges];
    newDateRanges[index][field] = new Date(value);
    setDateRanges(newDateRanges);
  };

  const handleSubmit = () => {
    const validRanges = dateRanges.filter(range => range.startDate && range.endDate);

    if (validRanges.length > 0) {
      publishListings(list.id, validRanges).then(() => {
        setIsPublished(true);
        handleClose();
      });
    } else {
      alert('Please select at least one valid date range.');
    }
  };

  const handleUnpublish = () => {
    unpublishListings(list.id).then(() => {
      setIsPublished(false);
    });
  };
  const totalRating = list.reviews.reduce((acc, review) => acc + review.rating.rating, 0);
  const averageRating = list.reviews.length > 0 ? totalRating / list.reviews.length : 0;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
  return (
    <>
      <div style={responsiveListingContainer} key={list.id}>
        <div style={responsiveImageContainer}>
          <img
            alt='Thumbnail'
            src={list.thumbnail}
            style={imageStyle}
          />
        </div>
        <div style={responsiveTextContainer}>
          <h3>Title: {list.title}</h3>
          <p>Type: {list.metadata.type}</p>
          <p>Beds: {list.metadata.numBed}</p>
          <p>Bathrooms: {list.metadata.numBathroom}</p>
          <div>Review rating: <RatingStars rating={averageRating} /></div><br />
          <p>&#x2B50;Total Reviews: {list.reviews.length}</p>
          <p>Price/night: ${list.price}</p>
          <button onClick={e => {
            navigate(`/editListing/${list.id}`);
          }} type="button" className="btn btn-warning">Edit</button>
          <button onClick={e => {
            deleteListings(list.id)
            navigate('/dashboard');
          }} type="button" className="btn btn-warning">Delete</button>
          {isPublished
            ? <button name="unpublish" onClick={handleUnpublish} type="button" className="btn btn-warning">Unpublish</button>
            : <button name="GoLive" onClick={handleOpen} type="button" className="btn btn-warning">Go Live</button>
          }
          <button onClick={e => {
            navigate(`/viewBookings/${list.id}`);
          }} type="button" className="btn btn-warning">View Bookings</button>
        </div>
      </div>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Available Dates</h2><br />
            {dateRanges.map((range, index) => (
            <div key={index}>
              Start Date: <input type='date' name = "startDate" onChange={e => updateDateRange(index, 'startDate', e.target.value)}></input><br /><br />
              End Date: <input type='date' name = "endDate" onChange={e => updateDateRange(index, 'endDate', e.target.value)}></input><br /><br />
            </div>
            ))}
            <button onClick={addDateRange} type="button" className="btn btn-warning">More Dates</button><br /><br />
            <button onClick={handleSubmit} type="button" className="btn btn-warning">Submit</button>
            <button onClick={handleClose} type="button" className="btn btn-warning">Cancel</button>
          </Box>
        </Modal>
      </div>
    </>
  )
}

const ShowAllListings = () => {
  const [listings, setListings] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  useEffect(() => {
    const fetchAndSetListingsWithMetadata = async () => {
      try {
        const response = await fetchListings();
        if (response && response.listings) {
          const listingsWithMetadata = await Promise.all(
            response.listings.map(async (listing) => {
              const metadataResponse = await fetch(`http://localhost:5005/listings/${listing.id}`);
              if (!metadataResponse.ok) {
                // Handle error or set default metadata
                console.log('Error fetching metadata for listing', listing.id);
                return listing; // Returning the listing without metadata in case of error
              }
              const details = await metadataResponse.json();
              return {
                ...listing,
                metadata: details.listing.metadata,
                published: details.listing.published,
                owner: details.listing.owner,
                reviews: details.listing.reviews
              };// Combine listing with its metadata and published status and current user
            })
          );
          setListings(listingsWithMetadata);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Handle errors appropriately
      }
    };

    fetchAndSetListingsWithMetadata();
  }, []);
  const filteredListings = listings.filter(listing => listing.owner === userEmail);
  return (
    <>
      <div>
      {filteredListings.map((listing, idx) => <SingleList key={idx} list={listing} />)}
      </div>
    </>
  );
};

export default ShowAllListings;
