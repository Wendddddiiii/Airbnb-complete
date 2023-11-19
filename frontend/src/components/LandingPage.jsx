import React, { useEffect, useState } from 'react';
import { fetchListings, fetchBookings } from './PostListing';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [listings, setListings] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [bedrooms, setBedrooms] = useState({ min: 0, max: 10 });
  const [dateRange, setDateRange] = useState([]);
  const [price, setPrice] = useState({ min: 0, max: 1000 });
  const [ratings, setRatings] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
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
  const fetchPublishedListings = async () => {
    try {
      const response = await fetchListings();
      if (response && response.listings) {
        const publishListings = await Promise.all(
          response.listings.map(async (listing) => {
            const publishedResponse = await fetch(`http://localhost:5005/listings/${listing.id}`);
            if (!publishedResponse.ok) {
              console.log('Error fetching published listing', listing.id);
              return listing;
            }
            const details = await publishedResponse.json();
            return {
              ...listing,
              metadata: details.listing.metadata,
              published: details.listing.published,
              availability: details.listing.availability,
              price: details.listing.price,
              reviews: details.listing.reviews.length
            };
          })
        );
        // Sort the listings alphabetically by title
        publishListings.sort((a, b) => {
          const titleA = a.title.toUpperCase(); // Ignore case
          const titleB = b.title.toUpperCase(); // Ignore case
          if (titleA < titleB) {
            return -1;
          }
          if (titleA > titleB) {
            return 1;
          }
          return 0; // Titles are equal
        });
        if (localStorage.getItem('token')) {
          fetchBookings()
            .then(bookingResponse => {
              const bookings = bookingResponse.bookings;
              for (let i = 0; i < publishListings.length; i++) {
                for (let j = 0; j < bookings.length; j++) {
                  if (bookings[j].id === publishListings[i].id) {
                    if (bookings[j].status === 'accepted' || bookings[j].status === 'pending') {
                      const remainingListing = publishListings[i];
                      publishListings.splice(i, 1);
                      publishListings.unshift(remainingListing);
                    }
                  }
                }
              }
            })
        }
        setListings(publishListings);
      }
    } catch (error) {
      console.error('Error fetching published listings:', error);
    }
  };

  const handleSearch = async () => {
    let filteredListings = [...listings];
    if (keyword) {
      const keywords = keyword.toLowerCase().split(' ');
      filteredListings = filteredListings.filter(listing => {
        const titleLower = listing.title.toLowerCase();
        const addressLower = listing.address.toLowerCase();
        return keywords.some(kw => titleLower.includes(kw) || addressLower.includes(kw));
      });
    }
    if (bedrooms.min !== undefined && bedrooms.max !== undefined) {
      filteredListings = filteredListings.filter(listing =>
        listing.metadata.numBedrooms >= bedrooms.min && listing.metadata.numBedrooms <= bedrooms.max);
    }
    if (price.min !== undefined && price.max !== undefined) {
      filteredListings = filteredListings.filter(listing =>
        listing.price >= price.min && listing.price <= price.max);
    }

    if (dateRange[0] && dateRange[1]) {
      const searchStart = new Date(dateRange[0]);
      const searchEnd = new Date(dateRange[1]);
      localStorage.setItem('searchStart', searchEnd.toISOString());
      localStorage.setItem('searchEnd', searchStart.toISOString());
      // Calculate the difference in days
      const differenceInTime = searchStart.getTime() - searchEnd.getTime();
      const differenceInDays = Math.abs(differenceInTime) / (1000 * 3600 * 24);
      if (searchStart < searchEnd) {
        alert('Your journey should start before it ends! Please choose the startdate and endDate again!');
      }
      filteredListings = filteredListings.filter(listing => {
        return listing.availability.some(range => {
          const rangeStart = new Date(range.startDate);
          const rangeEnd = new Date(range.endDate);
          const totalPrice = parseInt(listing.price) * differenceInDays;
          localStorage.setItem(`totalPrice-${listing.id}`, totalPrice.toString());
          console.log('total price is', totalPrice);

          // Check if the search range overlaps with the availability range
          return (searchStart <= rangeEnd) && (searchEnd >= rangeStart);
        });
      });
    }

    if (ratings) {
      filteredListings = listings.sort((a, b) => {
        return sortOrder === 'desc' ? b.metadata.ratings - a.metadata.ratings : a.metadata.ratings - b.metadata.ratings;
      });
      setSortOrder(sortOrder);
    }
    setListings(filteredListings);
  };
  useEffect(() => {
    fetchPublishedListings();
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
    <div>
      <input onChange={e => setKeyword(e.target.value)} type='text' placeholder='Search Airbrb home' style={{ flex: '1', margin: '0 5px' }} />
      <input type='number' onChange={e => setBedrooms({ ...bedrooms, min: Number(e.target.value) })} placeholder='Min Bedrooms' style={{ flex: '1', margin: '0 5px' }} />
      <input type='number' onChange={e => setBedrooms({ ...bedrooms, max: Number(e.target.value) })} placeholder='Max Bedrooms' style={{ flex: '1', margin: '0 5px' }} />
      <input type='number' onChange={e => setPrice({ ...price, min: Number(e.target.value) })} placeholder='Min Price' style={{ flex: '1', margin: '0 5px' }} />
      <input type='number' onChange={e => setPrice({ ...price, max: Number(e.target.value) })} placeholder='Max Price' style={{ flex: '1', margin: '0 5px' }} />
      Start Date:<input type='date' onChange={e => setDateRange([e.target.value, dateRange[1]])} /> End Date:<input type='date' style={{ flex: '1', margin: '0 5px' }} onChange={e => setDateRange([e.target.value, dateRange[0]])} />
      <input onChange={e => setRatings(e.target.value)} type='text' placeholder='Review ratings' style={{ flex: '1', margin: '0 5px' }} />
      <button onClick={handleSearch} type="button" className="btn btn-warning" style={{ marginLeft: 'auto' }}>Search&#x1F50D;</button>
      {listings.filter(listing => listing.published === true).map(listing => (
        <div key={listing.id} style={responsiveListingContainer}>
          <div style={responsiveImageContainer}>
            <img src={listing.thumbnail} alt={listing.title} style={imageStyle} />
          </div>
          <div style={responsiveTextContainer}>
            <h3>{listing.title}</h3>
            <p>Price/night: ${listing.price}</p>
            <p>&#x2B50;Total Reviews: {listing.reviews}</p>
            <button onClick={e => navigate(`./selectListing/${listing.id}`)} type="button" className="btn btn-warning" >More details</button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default LandingPage;
